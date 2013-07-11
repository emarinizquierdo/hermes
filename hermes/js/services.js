'use strict';

//var _URL = "http://localhost";
var _URL = "http://ec2-54-245-144-170.us-west-2.compute.amazonaws.com";

/* Services */
angular.module("Services",[])
.factory("FBase", ['$http', function($http) {

	var myDataRef = new Firebase('https://hermes.firebaseIO.com/');

	return { 	

		hermes : function(){

			return myDataRef;

		},

		createAccount : function( p_email, p_password, p_callback ){

			var Users = new Firebase('https://hermes.firebaseIO.com/users');

			Users.on('value', function(snapshot) {
				var users = snapshot.val();
				Users.off('value');
				var existUser = false;

				if(users){
					$.each(users, function(index, user){
						if(user.email == p_email){
							existUser = true;
						}
					});

				}
				
				if(!existUser){
					var UserObject = new Firebase('https://hermes.firebaseIO.com/users/'+guid());
					var user = { "email" : p_email, "password" : Sha1.hash(p_password,true) };
					UserObject.set( user );
					var authClient = new FirebaseAuthClient(myDataRef, function(error, user) {
					  if (error) {
					    // an error occurred while attempting login
					    console.log(error);
					  } else if (user) {
					    // user authenticated with Firebase
					    console.log('User ID: ' + user.id + ', Email: ' + user.email + ', Provider: ' + user.provider);
					  } else {
					    // user is logged out
					    console.log("user is logged out");
					  }
					});

					authClient.createUser(p_email, p_password, function(error, user) {
					  if (!error) {
					   	console.log('User ID: ' + user.id + ', Email: ' + user.email + ', Provider: ' + user.provider);
					    p_callback(true);
					  }
					});
										
				}else{
					p_callback(false);
				}
			});		

		},

		getDevices : function( p_user, p_callback){
			
			var Devices = new Firebase('https://hermes.firebaseIO.com/users/' + p_user + '/devices' );

			Devices.on('value', function(snapshot) {
				var devices = [];
				snapshot.forEach(function(device){
					var auxDevice = device.val();
					auxDevice.number = device.name();
					devices.push(auxDevice);
				});
				Devices.off('value');
				devices;
				p_callback(devices);


			});	
		},

		addDevice : function( p_user, p_device, p_callback ){

			var Devices = new Firebase('https://hermes.firebaseIO.com/users/' + p_user + '/devices');

			Devices.on('value', function(snapshot) {
				
				var devices = snapshot.val();
				Devices.off('value');
				var existDevice = false;

				if(devices){
					$.each(devices, function(i, e){
						if(e.id == p_device.id){
							existDevice = true;
						}
					});

				}
				
				if(!existDevice){
					var DeviceObject = new Firebase('https://hermes.firebaseIO.com/users/' + p_user + '/devices/' + p_device.number);
					var device = { "name" : p_device.name, "id" : p_device.id, "state" : p_device.state };
					DeviceObject.set( device );
					
					p_callback(true);
													
				}else{
					p_callback(false);
				}
			});		

		},

		deleteDevice : function( p_user, p_device_number, p_callback ){

			var DeviceObject = new Firebase('https://hermes.firebaseIO.com/users/' + p_user + '/devices/' + p_device_number);
			var device = null;
			DeviceObject.set( device );		
			p_callback(true);

		}	
	}

}])
.factory("Service", ['$http', function($http) {

	var myDataRef = new Firebase('https://hermes.firebaseIO.com/');
	
	return {

		login : function( p_email, p_password, p_rememberme, p_callback ){

			var url = _URL;
			var parameters = "login=true&email=" + p_email + "&password=" + Sha1.hash(p_password);
			var config = { headers : { "Content-Type" : "application/x-www-form-urlencoded" } };

			$http.post( url, parameters, config).success(function(data){

				var authClient = new FirebaseAuthClient(myDataRef, function(error, user) {
				
					if (error) {
					    // an error occurred while attempting login
					    console.log(error);
					} else if (user) {
					    // user authenticated with Firebase
					    console.log('User ID: ' + user.id + ', Email: ' + user.email + ', Provider: ' + user.provider);
					    p_callback(data);
					} else {
					    // user is logged out
					    console.log("user is logged out");
					}
				});

				authClient.login('password', {
				  email: p_email,
				  password: p_password
				});			

			});

		},

		logout : function( p_callback ){

			var authClient = new FirebaseAuthClient(myDataRef, function(error, user) {
			  if (error) {
			    // an error occurred while attempting login
			    console.log(error);
			  } else if (user) {
			    // user authenticated with Firebase
			    console.log('User ID: ' + user.id + ', Email: ' + user.email + ', Provider: ' + user.provider);
			  } else {
			    // user is logged out
			    console.log("user is logged out");
			    $http.post( url, parameters, config).success(function(data){

				p_callback(data);
				
			});
			    
			  }
			});

			var url = _URL;
			var parameters = "logout=true";
			var config = { headers : { "Content-Type" : "application/x-www-form-urlencoded" } };

			authClient.logout();			

		}

	}

}]);