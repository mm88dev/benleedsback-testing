- on delete,edit, create item ask if status is regular or extra
    - if extra - each action is repeated for each of the 19 rooms    
    - edit and delete will work with comparing name, subCategory and price
    - extraItem will always come with room: "Living Room" from front

- na getTempWorkorder posalji set itema samo za jednu sobu, ne sve



- solution for emailPassword hashing - one more field at login page
- email from admin to vendor should contain building address - workorder should contain building address field




- ISSSUES

for loop/ array.forEach do not modify/add/delete properties on objects returned from database ?
had to create updatedJobs( and similar) 



- LESSONS

- additional folder in models /operations so files in models simply call these functions with parameters
    - /operations files can be create.js read.js delete.js and update.js (maybe connectCollections.js ?)
    - add another parameter to models functions that reveals if callback(res, data) follows it immediately

- middlewares folder
- routes file



- AUTOSAVE

- on each entry add item _id field to object in tempJobs under id field
- each object in tempJobs must have an user 






