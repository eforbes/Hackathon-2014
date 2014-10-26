var express = require('express');

module.exports = function(app, passport) {

	//set the public/ directory as static
	app.use('/public', express.static('public'));


	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs', { user: req.user, nav: 'Home'}); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

    // process the schedule form
    //
    // ====================================
    // SCHEDULE SECTION====================
    // ====================================
    // schedule is dependent on user so must be logged in
    app.get('/schedule', isLoggedIn, function(req, res) {
        res.render('schedule.ejs', {
            user : req.user, nav: 'Map'
        });
    });

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


  app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/setup', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

  // process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	app.get('/setup', function(req, res){
			res.render('setup.ejs', {user: req.user, reqCourses: ['test','test2']});
	});

	app.post('/setup', function(req, res){
		console.log('setup submit: '+JSON.stringify(req.body));
			res.redirect('/schedule');
	});

	app.get('/admin', function(req, res){
			res.render('admin.ejs', {user: req.user});
	});

	app.post('/admin', function(req, res){
		console.log('admin submit: '+JSON.stringify(req.body));
			res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
