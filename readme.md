# My App: QvikPost - Notetaker 📝
Super simple PostIt Note like app, to quikly write what on your mind.

## Render: ⚡
https://qvik.onrender.com

## Fazes: Functions too implemnts 🐌
**Faze #1: Mains**
- User: Creation, save, edit, delete.
- Notes: Write, save, delete, edit notes 

**Faze #1.5: Mains importrant**
- Database and server stuff

**Faze #2: Next, Get this up!** 
- Store in Database 
    - User info
    - Notes

**Faze #3: Add On, Maybe, just maybe, if time**
- Translate option?
- Sharing option?

**Faze #4: More Stuff**
- Clean up code
- Add CSS too, make beutiful 

**The "Must" Task:** 
- The App
- Database/Server
- Render

**Value 🛋️**
Difficulty: Moderate 
Scope: Moderate 
Skill alignment: Ok-ambitious

*Danny Nguyen Le 🥕*
*MM-207-G 24V Applikasjonsutvikling 2*

# Semester project 🎒

## Description
This is our template for the semester project. It contains a basic structure for the project and a few examples of how to use the different parts of the project. You must expand upon the project, refactor when nessasary and make it your own.

## Projectmanagment
We use [Trello](https://trello.com/b/FHCiBdTb/demo) for projectmanagment. You can find the board [here](https://trello.com/b/FHCiBdTb/demo).
Note that you should create your own board for your project.

## Getting started
To get started with the project you need to clone the repository and open it in your favorite IDE. We recommend using VS Code.
Once you have cloned the repository you need to install the dependencies. This is done by running the following command in the terminal:
```
npm install
```

You also need to edit the .env file with values for:
- DB_CONNECTIONSTRING , this is the connectionstring to your database
- DB_SSL, if runing localy this needs to be false


Once the dependencies are installed and the database is runing you can run the project by running the following command in the terminal:
```
node server.mjs
```
This will start the server and you can now access the project on http://localhost:8080 in your browser.
