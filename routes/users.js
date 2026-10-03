const express = require('express');
const { users } = require('../data/user.json');

const router = express.Router();


/**
 * Route: /users
 * Method: GET
 * Description: Get all the list of users in the system
 * Access: Public
 * Parameters: None
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    })
})

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get a user by ID
 * Access: Public
 * Parameters: id (user ID)
 */
router.get("/:id", (req, res) => {

    const {userId} = req.params.id;
    const {user} = users.find((each) => each.id === userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${userId}`
        });
    }

    res.status(200).json({
        success: true,
        data: user
    });
});


/**
 * Route: /users/
 * Method: POST
 * Description: Create/Register a new user
 * Access: Public
 * Parameters: None
 */
router.post("/", (req, res) => {
// req.body should have the following fields    
    const { id, name, email, issuedDate, returnDate, subscriptionType, subscriptionDate } = req.body;

    // check if all the required fields are present
    if (!id || !name || !email || !issuedDate || !returnDate || !subscriptionType || !subscriptionDate) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // check if the user already exists
    const {user} = users.find((each) => each.id === id);
    if (user) {
        return res.status(400).json({
            success: false,
            message: `User already exists with id: ${id}`
        });
    }

    // If all the checks are passed, create a new user and push it to the users array
    users.push({ id, name, email, issuedDate, returnDate, subscriptionType, subscriptionDate });

    res.status(201).json({
        success: true,
        message: "User created successfully"
    });
});


/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating a user by their ID
 * Access: Public
 * Parameters: id (user ID)
 */
router.put("/:id", (req, res) => {
    const {userId} = req.params.id;
    const {data} = req.body;

    // Check if the user exists
    const {user} = users.find((each) => each.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${userId}`
        });
    }

// Object.assign(user, data);
// with Spread Operator
    const updatedUsers = users.map((each) =>{
        if(each.id === userId){
            return {
                ...each,
                ...data
            }
        }
    })

    res.status(200).json({
        success: true,
        message: "User updated successfully"
    });
});

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by their ID
 * Access: Public
 * Parameters: id (user ID)
 */
router.delete("/:id", (req, res) => {
    const {userId} = req.params.id;

    // Check if the user exists
    const {user} = users.find((each) => each.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${userId}`
        });
    }

    // If user exists, filter it out from the users array
    const updatedUsers = users.filter((each) => each.id !== userId);
//      2nd method
//      const index = users.indexOf(user);
//      users.splice(index, 1);

    res.status(200).json({
        success: true,
        data: updatedUsers,
        message: "User deleted successfully"
    });
});

/**
 * Route: /users/:id/subscription
 * Method: GET
 * Description: Get all the subscription details of a user by their ID
 * Access: Public
 * Parameters: id (user ID)
 */
router.get("/subscription-details/:id", (req, res) => {
    const {userId} = req.params;

    // find the user by ID
    const {user} = users.find((each) => each.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${userId}`
        });
    }
    // Extract the subscription details
    const getDateInDays = (data = "") => {
        let date;
        if(data) {
            date = new Date(data);
        } else {
            date = new Date();
        }
        let days = Math.floor(date/ (1000 * 60 * 60 * 24));
        return days;
    }

    const subscriptionType = (date) => {
        if(user.subscriptionType === "Basic") {
            date = date + 90;
        }else if(user.subscriptionType === "Standard") {
            date = date + 180;
        }else if(user.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    };

    // subscription Exparition Calculation
    // January 1, 1970 UTC // milliseconds
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        subscriptiondaysLeft: subscriptionExpiration - currentDate,
        daysLeftForExpiration: returnDate - currentDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    }
    res.status(200).json({
        success: true,
        data
    });
});

module.exports = router;
// This is the users router for the Library Management System.