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
	var authenticate = getAuth();
	$("#code").hide();
    if(authenticate.email && authenticate.session_hash) {
		authenticate = JSON.stringify(authenticate);
		ajaxCall('POST', '/api/authenticate', authenticate, successfulLogin, failedLogin);
	} 
}

function getAuth() {
	var authenticate = {};
	authenticate.email = $.cookie('email'); 
    authenticate.session_hash = $.cookie('session_hash');
    return authenticate;
}

function getUserHtml() {
	var authenticate = getAuth();

    if(authenticate.email && authenticate.session_hash) {
		authenticate = JSON.stringify(authenticate);
		ajaxCall('POST', '/api/getuserhtml', authenticate, userHtmlReceived, errorHtmlCode);
	} 
}

function userHtmlReceived(data) {
	htmlEditor.setValue(htmlUnescape(data.success));
}


function getUserCss() {
	var authenticate = getAuth();

    if(authenticate.email && authenticate.session_hash) {
		authenticate = JSON.stringify(authenticate);
		ajaxCall('POST', '/api/getusercss', authenticate, userCssReceived, errorCssCode);
	} 
}

function userCssReceived(data) {
	cssEditor.setValue(data.success);
}

function successfulLogin(user) {
	console.log("Returned successful login for user " + user);
	if(user[0]) {
		updateUserInfo(user[0]);
		$("#code").show();
		resetMessages();
		resetLogin();
	}
}

function updateUserInfo(user) {
	console.log("###### updateUserInfo");
	console.log(user);
	$.cookie('email', user.email_hash, { expires: 7 });
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
    html.html = escapePreTags(htmlEditor.getValue());

    if(html.email && html.session_hash) {
		html = JSON.stringify(html);
		ajaxCall('POST', '/api/savehtml', html, successHtmlCode, errorHtmlCode);
	} 
}

function escapePreTags(html) {

	var htmlElement = $(html);
	var preElement = htmlElement.find('pre').html();
	var escapedHtml = htmlEscape(preElement);

    htmlElement.html($(htmlElement).html().replace(preElement, escapedHtml));
    return htmlElement.html();
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

function getMembersContribution() {
	console.log("getMembersContribution");
	ajaxCall('POST', '/api/gethtml', '', displayLearning, failedLearning);
}

function displayLearning(data) {
	console.log("displayLearning");
	console.log(data.success[0].css.rulelist)
	var learnElement = $("#memberCode");
	learnElement.empty();
	if(data.success) {
		console.log("displayLearning count: " + data.success.length);
		for(var htmlRecord = 0; htmlRecord < data.success.length; htmlRecord++) {
			var html = data.success[htmlRecord];
			processHtmlResult(html, learnElement);
			console.log('$$$$$$$$$$$$$$$')
			console.log(html.css.rulelist)
			if(html.css.rulelist) {
				processCss(html.css.rulelist, html.html_uuid);
			}
		}
	}
}

function processHtmlResult(htmlRecord, learnElement) {
	var memberDiv = $('<div class="memberSection" id="'+htmlRecord.html_uuid+'">');
	memberDiv.append(htmlRecord.html);
	applyBaseCssToDiv(memberDiv);
	learnElement.append(createHeader(htmlRecord));
	learnElement.append(memberDiv);
}

function createHeader(htmlRecord) {
	console.log(htmlRecord)
	var header = '<div class="panel panel-default"><div class="panel-heading"><h2 class="panel-title"><h4><i class="fa fa-user purple"></i>&nbsp;'+ htmlRecord.name + ' - ' + htmlRecord.city + ' - ' + htmlRecord.coderdojo + '</h4></h2></div></div>';
	return header;
}

function applyBaseCssToDiv(element) {
	element.css({
		"border-bottom": "1px solid #ddd",
		"margin-top": "20px",
		"width": "100%",
		"position": "relative",
		"padding": "0px"
	});
}

function processCss(cssJson, html_uuid) {
	if(cssJson) {
		for(var cssElement = 0; cssElement < cssJson.length; cssElement++) {

			var css = cssJson[cssElement];
			if(css.type = "style") {
				var styleElements = $("#"+html_uuid + " " + css.selector);
				if(styleElements) {
					applyCssToElements(styleElements,  css.declarations)
				}
			}
		}
	}
}

function applyCssToElements(elements, styles) {

	if(elements) {
		if(elements.length == 1) {
			elements.css(styles)
		} else {
			for(var htmlElement; htmlElement < elements; htmlElement++) {
				elements[htmlElement].css(styles);
			}
		}
	}
}


function failedLearning(data) {
	console.log("Failing learning");
	console.log(data);
}

function htmlEscape(htmlToEscape) {
    return String(htmlToEscape)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

function htmlUnescape(htmlString){
    return String(htmlString)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
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
getMembersContribution();

