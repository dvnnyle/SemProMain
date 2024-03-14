// usersRoute.mjs

import express from 'express';
import pool from '../db.mjs'; 
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import User from '../modules/user.mjs';


const USER_API = express.Router();
USER_API.use(express.json());


USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("An important msg", SuperLogger.LOGGING_LEVELS.CRITICAL);
});

USER_API.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (name && email && password) {
        try {
            const userToUpdate = new User();
            userToUpdate.id = userId;
            userToUpdate.name = name;
            userToUpdate.email = email;
            userToUpdate.pswHash = password; 

            const updatedUser = await userToUpdate.save();

            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(HTTPCodes.ServerErrorRespons.InternalServerError).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({ error: 'Bad Request', message: 'Missing data fields' });
    }
});

USER_API.post('/', async (req, res, next) => {
    const { name, email, password } = req.body;

    if (name && email && password) {
        try {
            const result = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [name, email, password]
            );

            const newUser = result.rows[0];
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(HTTPCodes.ServerErrorRespons.InternalServerError).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({ error: 'Bad Request', message: 'Missing data fields' });
    }
});

USER_API.delete('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

        if (result.rows.length === 0) {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ error: 'User not found' });
        } else {
            const deletedUser = result.rows[0];
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: 'User deleted successfully', user: deletedUser });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(HTTPCodes.ServerErrorRespons.InternalServerError).json({ error: 'Internal Server Error' });
    }
});

USER_API.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({ error: 'Bad Request', message: 'Missing email or password' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ error: 'User not found' });
        }

        const user = result.rows[0];
//compare PW
        if (password !== user.password) {
            return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).json({ error: 'Invalid password' });
        }

        res.status(HTTPCodes.SuccesfullRespons.Ok).json({ user: { id: user.id, name: user.name, email: user.email, notes: user.notes } });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(HTTPCodes.ServerErrorRespons.InternalServerError).json({ error: 'Internal Server Error' });
    }
});

USER_API.post('/:userId/notes', async (req, res) => {
    const loggedInUserId = parseInt(req.params.userId);  // Get the ID her :DA)=D
    const { notes } = req.body;

    try {
        const result = await pool.query('UPDATE users SET notes = array_cat(notes, $1) WHERE id = $2 RETURNING *', [notes, loggedInUserId]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ message: 'Notes updated successfully', user: result.rows[0] });
        }
    } catch (error) {
        console.error('Error updating notes:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


USER_API.delete('/:userId/notes/:noteIndex', async (req, res) => {
    const loggedInUserId = parseInt(req.params.userId);  
    const noteIndex = parseInt(req.params.noteIndex);  

    try {
        // Fetch the user = existo
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [loggedInUserId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        if (!user.notes || noteIndex < 0 || noteIndex >= user.notes.length) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Remove the note from the array
        user.notes.splice(noteIndex, 1);

        // Update the user in the database
        const updateResult = await pool.query('UPDATE users SET notes = $1 WHERE id = $2 RETURNING *', [user.notes, loggedInUserId]);

        if (updateResult.rows.length === 0) {
            return res.status(500).json({ message: 'Failed to update notes' });
        }

        res.json({ message: 'Note deleted successfully', user: updateResult.rows[0] });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

USER_API.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (name && email && password) {
        try {
            const result = await pool.query(
                'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
                [name, email, password, userId]
            );

            if (result.rows.length === 0) {
                res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ error: 'User not found' });
            } else {
                const updatedUser = result.rows[0];
                res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: 'User updated successfully', user: updatedUser });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(HTTPCodes.ServerErrorRespons.InternalServerError).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).json({ error: 'Bad Request', message: 'Missing data fields' });
    }
});

USER_API.put('/:userId/notes', async (req, res) => {
    const loggedInUserId = parseInt(req.params.userId);
    const { notes } = req.body;

    try {
        const result = await pool.query('UPDATE users SET notes = $1 WHERE id = $2 RETURNING *', [notes, loggedInUserId]);

        if (result.rows.length === 0) {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).json({ message: 'User not found' });
        } else {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: 'Notes updated successfully', user: result.rows[0] });
        }
    } catch (error) {
        console.error('Error updating notes:', error);
        res.status(HTTPCodes.ServerErrorRespons.InternalServerError).json({ message: 'Internal Server Error' });
    }
});


export { USER_API };



