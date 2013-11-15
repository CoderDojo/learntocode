var htmlEditor;

function register() {
	resetMessages();
	var user = {};
	user.name = $("#reg_name").val();
	user.password = $("#reg_password").val();
	user.email = $("#reg_email").val();
	user.coderdojo = $("#reg_coderdojo").val();
	user.city = $("#reg_city").val();
	user = JSON.stringify(user);
	ajaxCall('POST', '/api/register', user, successfulRegistation, failedRegistation);
}

function login() {
	console.log('Logging in');
	resetMessages();
	var user = {};
	user.password = $("#login_password").val();
	user.email = $("#login_email").val();
	user = JSON.stringify(user);
	console.log(user);
	ajaxCall('POST', '/api/login', user, successfulLogin, failedLogin);
}

function authenticate() {
	var authenticate = {};
	authenticate.email = $.cookie('email'); 
    authenticate.session_hash = $.cookie('session_hash'); 

    if(authenticate.email && authenticate.session_hash) {
		authenticate = JSON.stringify(authenticate);
		ajaxCall('POST', '/api/authenticate', authenticate, successfulLogin, failedLogin);
	} else {
		$("#code").hide();
	}
}


function successfulLogin(user) {
	updateUserInfo(user[0]);
	resetMessages();
	resetLogin();
}

function updateUserInfo(user) {
	console.log("###### updateUserInfo");
	console.log(user);
	$("#signuplink").hide();
	$("#loginlink").hide();
	$("#signup").hide();
	$("#login").hide();
	$("#profile").empty();
	$("#profile").append(user.name + " | <a onclick='logout()'>Logout</a>");
	$.cookie('email', user.email, { expires: 7 });
	$.cookie('session_hash', user.session_hash, { expires: 7 });
	$("#code").show();
	displayEditors();
}

function displayEditors() {
	displayHTMLEditor();
	displayCSSEditor();
}

function displayHTMLEditor() {
	htmlEditor = CodeMirror(document.getElementById("htmlEditor"), {
      mode: "text/html",
      matchTags: {bothTags: true},
      value: "<div> </div>",
	  lineNumbers: true,
      styleActiveLine: true
	});
	htmlEditor.setOption("theme", "solarized dark");
}


function displayCSSEditor() {
	var cssEditor = CodeMirror(document.getElementById("cssEditor"), {
      mode: "text/css",
      value: "/* write css here */",
      matchBrackets: true,
	  lineNumbers: true,
	  styleActiveLine: true

	});
	cssEditor.setOption("theme", "solarized light");
}


function resetMessages() { 
	$('#reg_error').empty();
	$('#reg_success').empty();
	$('#login_error').empty();
	$('#login_success').empty();
}

function logout() {
	$.removeCookie('email');
	$.removeCookie('session_hash');
	$("#signup").show();
	$("#login").show();
	$("#profile").empty();
	$("#code").hide();
}

function resetLogin() {
	$("#login_password").val('');
	$("#login_email").val('');
}

function failedLogin(data) {
	var errorDiv = $('#login_error')
	errorDiv.show();
	errorDiv.empty();
	console.log(data.error);
	displayError(data,errorDiv);
	$("#code").hide();
}


function successfulRegistation(user) {
	updateUserInfo(user);
	resetMessages();
	resetRegister();
}

function resetRegister() {
	$("#reg_name").val('');
	$("#reg_password").val('');
	$("#reg_email").val('');
	$("#reg_coderdojo").val('');
	$("#reg_city").val('');
}

function failedRegistation(data) {
	var errorDiv = $('#reg_error')
	errorDiv.show();
	errorDiv.empty();
	console.log(data.error);
	displayError(data,errorDiv);
}

function displayError(data,errorDiv) {
	var message = data.error.message
	message += '<ul>'
	
	for (msg in data.error.list) {
		message += '<li>'+data.error.list[msg]+'</li>'
	}
	
	message += '</ul>'
	errorDiv.append(message)
}

function saveHtml() {
	console.log(htmlEditor.getValue());
	var html = {};
	html.email = $.cookie('email'); 
    html.session_hash = $.cookie('session_hash'); 
    html.html = htmlEditor.getValue();

    if(html.email && html.session_hash) {
		html = JSON.stringify(html);
		ajaxCall('POST', '/api/savehtml', html, successHtmlCode, errorHtmlCode);
	} 
}

function successHtmlCode() {
  console.log('success')
}


function errorHtmlCode() {
  console.log('error')
}

function ajaxCall(type, url, data, success, error) {
    $.ajax({
            type : type,
            url : url,
            data : data,
            success : function(response) {
            	console.log(response)
            	success(response)
            },
            dataType : "json",
            contentType : 'application/json',
            error : function(jqXHR, textStatus, errorThrown) {
        	   var response = jQuery.parseJSON(jqXHR.responseText)
               error(response)     
            }
    });
}
	


authenticate();

