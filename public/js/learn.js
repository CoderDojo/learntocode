var htmlEditor;
var cssEditor;

function register() {
	console.log("Registering ............");
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

function getUserHtml() {
	var authenticate = {};
	authenticate.email = $.cookie('email'); 
    authenticate.session_hash = $.cookie('session_hash'); 

    if(authenticate.email && authenticate.session_hash) {
		authenticate = JSON.stringify(authenticate);
		ajaxCall('POST', '/api/getuserhtml', authenticate, userHtmlReceived, errorHtmlCode);
	} 
}

function userHtmlReceived(data) {
	htmlEditor.setValue(data.success);
}


function getUserCss() {
	var authenticate = {};
	authenticate.email = $.cookie('email'); 
    authenticate.session_hash = $.cookie('session_hash'); 

    if(authenticate.email && authenticate.session_hash) {
		authenticate = JSON.stringify(authenticate);
		ajaxCall('POST', '/api/getusercss', authenticate, userCssReceived, errorCssCode);
	} 
}

function userCssReceived(data) {
	cssEditor.setValue(data.success);
}

function successfulLogin(user) {
	if(user[0]) {
		updateUserInfo(user[0]);
		resetMessages();
		resetLogin();
	}
}

function updateUserInfo(user) {
	console.log("###### updateUserInfo");
	console.log(user);
	$.cookie('email', user.email, { expires: 7 });
	$.cookie('session_hash', user.session_hash, { expires: 7 });
	getUserHtml();
	getUserCss();
	$("#signuplink").hide();
	$("#loginlink").hide();
	$("#signup").hide();
	$("#login").hide();
	$("#profile").empty();
	$("#profile").append(user.name + " | <a onclick='logout()'>Logout</a>");
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
	cssEditor = CodeMirror(document.getElementById("cssEditor"), {
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

function resetHtml() {
	$("#html_error").empty();
	$("#html_error").hide();
	$("#html_success").empty();
	$("#html_success").hide();
}

function saveHtml() {
	console.log(htmlEditor.getValue());

	resetHtml()

	var html = {};
	html.email = $.cookie('email'); 
    html.session_hash = $.cookie('session_hash'); 
    html.html = htmlEditor.getValue();

    if(html.email && html.session_hash) {
		html = JSON.stringify(html);
		ajaxCall('POST', '/api/savehtml', html, successHtmlCode, errorHtmlCode);
	} 
}

function successHtmlCode(data) {
	var successDiv = $('#html_success')
	successDiv.show();
	successDiv.empty();
	successDiv.append('Successfully updated html');
}


function errorHtmlCode(data) {
	var errorDiv = $('#html_error')
	errorDiv.show();
	errorDiv.empty();
	console.log(data.error);
	displayError(data,errorDiv);
}


function resetCss() {
	$("#css_error").empty();
	$("#css_error").hide();
	$("#css_success").empty();
	$("#css_success").hide();
}

function saveCss() {
	console.log(cssEditor.getValue());

	resetCss()

	var css = {};
	css.email = $.cookie('email'); 
    css.session_hash = $.cookie('session_hash'); 
    css.css = cssEditor.getValue();

    if(css.email && css.session_hash) {
		css = JSON.stringify(css);
		ajaxCall('POST', '/api/savecss', css, successCssCode, errorCssCode);
	} 
}

function successCssCode(data) {
	var successDiv = $('#css_success')
	successDiv.show();
	successDiv.empty();
	successDiv.append('Successfully updated CSS');
}


function errorCssCode(data) {
	var errorDiv = $('#css_error')
	errorDiv.show();
	errorDiv.empty();
	console.log(data.error);
	displayError(data,errorDiv);
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

