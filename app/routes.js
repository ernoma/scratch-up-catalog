module.exports = function(app, passport, User, Role, UserRole, Idea) {

    //
    // Param functions
    //
    app.param('ideaid', function (req, res, next, ideaid) {
	Idea.findById(ideaid, function (err, idea) {
            if (err) {
                console.log(err);
                return next(err);
            }
	    req.idea = idea;
	    return next();
	});
    });


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', {
	    user: req.user ? req.user : undefined,
	    title: 'Scratch Up Catalog'
	});
    });

    //
    // Get Idea, Volunteer, Talents and About pages
    //
    
    app.get('/idea', isLoggedIn, function(req, res) {
	Role.find({}, function(err, roles) {
	    res.render('idea.ejs', {
		user: req.user ? req.user : undefined,
		title: 'Scratch Up Catalog',
		roles: roles
            });
	});
    });

    app.get('/volunteer', isLoggedIn, function(req, res) {
	Role.find({}, function(err, roles) {
	    Idea.find({}, function(err, ideas) {
		res.render('volunteer.ejs', {
		    user: req.user ? req.user : undefined,
		    title: 'Scratch Up Catalog',
		    roles: roles,
		    ideas: ideas
		});
	    });
	});
    });

    app.get('/talents', isLoggedIn, function(req, res) {
        res.render('talents.ejs', {
            user: req.user ? req.user : undefined,
            title: 'Scratch Up Catalog'
        });
    });

    app.get('/talents/:ideaid', isLoggedIn, function(req, res) {
        res.render('talents.ejs', {
            user: req.user ? req.user : undefined,
            title: 'Scratch Up Catalog',
	    idea: req.idea
        });
    });

    app.get('/about', function(req, res) {
        res.render('about.ejs', {
            user: req.user ? req.user : undefined,
            title: 'Scratch Up Catalog'
        });
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage'),
				title: 'Scratch Up Catalog'}); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

	Role.find({}, function(err, roles) {
            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', { message: req.flash('signupMessage'),
				       title: 'Scratch Up Catalog',
				       roles: roles});
	});
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        Role.find({}, function(err, roles) {
	    res.render('profile.ejs', {
		user : req.user,// get the user out of session and pass to template
		title: 'Scratch Up Catalog',
		roles: roles
	    });
	});
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // LOCAL SIGNUP ==============================
    // =====================================
    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
    }));

    // =====================================
    // LOCAL LOGIN ==============================
    // =====================================
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // =====================================
    // FACEBOOK AUTHENTICATION =============
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    // =====================================
    // GOOGLE AUTHENTICATION ===============
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });


    //
    // Functions to get JSON data from mongoose
    //
    app.get('/ideas', function(req, res, next) {
        Idea.find({}, function(err, ideas) {
	    if (err) {
                console.log(err);
                return next(err);
            }
            
	    res.json(ideas);
        });
    });

    app.get('/roles', function(req, res, next) {
        Role.find({}, function(err, roles) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.json(roles);
        });
    });

    app.get('/users', function(req, res, next) {
        User.find({}, function(err, users) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.json(users);
        });
    });

    //
    // Functions to post data to server
    //
    app.post('/idea', function(req, res, next) {
	var newIdea = new Idea();

	//console.log(req.body);

	newIdea.title = req.body.title;
	newIdea.description = req.body.description;
	newIdea.status = req.body.status;
	newIdea.site = req.body.site;
	newIdea.developmentSite = req.body.development_site;

	User.findById(req.body.user_id, function (err, user) {
	    if (err) {
		console.log(err);
		return next(err);
	    }
	    //console.log(user);

	    newIdea.creator = user;

	    //console.log(req.body['neededRoles[]']);

	    Role.find({
		'_id': { $in: req.body['neededRoles[]'] }
	    }, function (err, roles) {
		if (err) {
                    console.log(err);
                    return next(err);
		}
		//console.log(roles);

		newIdea.neededRoles = roles;

		newIdea.save(function(err) {
		  if (err)
		  return next(err);
		  
		  res.json(201, newIdea);
		  });
	    });
	});
    });

    app.post('/idea/:ideaid', isLoggedIn, function(req, res, next) {
	
	var idea = req.idea;
	console.log(req.body);

	idea.title = req.body.title;
	idea.description = req.body.description;
	idea.status = req.body.status;
	idea.site = req.body.site;
	idea.developmentSite = req.body.developmentSite;
	idea.neededRoles = req.body.neededRoles;

	idea.save(function(err) {
            if (err)
                return next(err);
	    
            res.json(201, idea);
        });
    });

    
    app.post('/profile', function(req, res, next) {
	//console.log(req.body);
	
	User.findById(req.body.user_id, function (err, user) {
            if (err) {
                console.log(err);
                return next(err);
            }

	    //console.log(user);

	    user.name = req.body.name;
	    user.available = req.body.available;
	    user.description = req.body.description;
	    user.skills = req.body.skills;
	    user.sites = req.body.sites;
	    user.interestingRoles = req.body.interestingRoles;

	    user.save(function(err) {
                if (err) {
		    console.log(err);
                    return next(err);
		}

                res.json(201, user);
            });
	});
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
