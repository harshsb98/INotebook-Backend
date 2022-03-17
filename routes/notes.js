const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE1: Get all the Notes using: GET "/api/notes/getuser" .Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try{
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);}
  catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

//ROUTE2: Add a new note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a Valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
      try{
      const {title,description,tag}=req.body
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note= new Note({
        title,description,tag,user:req.user.id
    })
    const savednote = await note.save()
    res.json(savednote)
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }}
);

//ROUTE3: Update an existing note using: POST "/api/notes/updatenote". Login required
router.put(
    "/updatenote/:id",fetchuser,async (req, res) => {
        const {title,description,tag}=req.body;
        //Create a new Note object
        const newNote={};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}

        //Find the note to be updated & update it
        let note= await Note.findById(req.params.id);
        if(!note){return req.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note =await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})
        res.json({note});
    })
module.exports = router;
