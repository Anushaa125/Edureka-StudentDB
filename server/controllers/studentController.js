const Student = require('../models/student');
const mongoose = require('mongoose');

/** 
 * GET/
 * Home Page
*/

exports.homepage = async (req, res) => {

    const messages = await req.flash('info');

        const locals = {
            title: 'StudentDB',
            description: 'NodeJs Student Management System'
        }
        let perPage = 5;
        let page = req.query.page || 1;

        try {
            const students = await Student.aggregate([ { $sort: {updatedAt: -1 } } ])
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec();
            const count = await Student.countDocuments({});

            res.render('index', {
                locals,
                students,
                current: page,
                pages: Math.ceil(count / perPage),
                messages
            });
            
        } catch (error) {
            console.log('error')
            
        }

    };

/*
exports.homepage = async (req, res) => {

    const messages = await req.flash('info');

        const locals = {
            title: 'StudentDB',
            description: 'NodeJs Student Management System'
        }

        try {
            const students = await Student.find({}).limit(22);
            res.render('index', { locals, messages, students });
        } catch (error) {
            console.log('error');
        }

}
*/
/**
 * Get
 * About
 */
exports.about = async (req, res) => {

        const locals = {
            title: 'About',
            description: 'NodeJs Student Management System'
        }

        try {
            res.render('about', locals);
        } catch (error) {
            console.log('error');
        }

}

/** 
 * GET/
 * New Student Form
*/

exports.addStudent = async (req, res) => {

    const locals = {
        title: 'Add New Student',
        description: 'NodeJs Student Management System'
    }

    res.render('student/add', locals);
}


/** 
 * POST/
 * craete new Student
*/

exports.postStudent = async (req, res) => {
    console.log(req.body);

    const newStudent = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email
    })
    const locals = {
        title: 'New Student Added',
        description: 'NodeJs Student Management System'
    }

    try {      
        await Student.create(newStudent);
        await req.flash('info', 'New Student has been added....!!!!!');

        res.redirect('/');
    } catch (error) {
        console.log('error');
    }

   /*res.render('student/add', locals);*/
}

/** 
 * GET/
 * Student Data
*/
exports.view = async (req, res) => {
 
    try {
        const student = await Student.findOne({ _id: req.params.id});

        const locals = {
            title: 'View Student Data',
            description: 'NodeJs Student Management System'
        };
        res.render('student/view', {
            locals,
            student
        })
    }catch (error) {
        console.log(error)
    }
}


/** 
 * GET/
 * Edit student data
*/
exports.edit = async (req, res) => {
 
    try {
        const student = await Student.findOne({ _id: req.params.id});

        const locals = {
            title: 'Edit Student Data',
            description: 'NodeJs Student Management System'
        };
        res.render('student/edit', {
            locals,
            student
        })
    }catch (error) {
        console.log(error)
    }
}

/** 
 * GET/
 * Update student data
*/
exports.editPost = async (req, res) => {
 
   try {
    await Student.findOneAndUpdate({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        details: req.body.details,
        updatedAt: Date.now()
    }).where(req.params.id)

    res.redirect(`/edit/${req.params.id}`);
    console.log("redirected")
   } catch (error) {
    console.log(error);
   }
}

/** 
 * Delete/
 * Delete student data
*/
exports.deleteStudent = async (req, res) => {
 
    try {
     await Student.deleteOne({_id: req.params.id});
     res.redirect("/");
    } catch (error) {
     console.log(error);
    }
 };

 /** 
 * Get/
 *Search student data
*/
exports.searchStudent = async (req, res) => {
    const locals = {
        title: "Search Student Data",
        description: "NodeJS Student Management System "
    };
    try {
        let searchTerm = req.body.searchTerm;
        const serachNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g,"");

        const students = await Student.find({
            $or: [
                {firstName: {$regex: new RegExp(serachNoSpecialChar, "i")}},
                {lastName: {$regex: new RegExp(serachNoSpecialChar, "i")}},
            ],
        });
        res.render("Search", {
            students,
            locals,
        });
    } catch (error) {
        console.log(error);
    }


 }