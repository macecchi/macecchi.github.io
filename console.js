// By Mario Cecchi (macecchi@gmail.com)
// http://meriw.com

$(document).ready(function() {
	init_text = "meriw$";
	version = "0.2";
	cursor = "&nbsp;";
	default_theme = "homebrew";
	welcome_text = "Welcome to meriw (version " + version + ")\nThis is the personal website Type 'help' for a list of available commands.";
	available_commands = new Array(
	"about - About me",
	"email - My email",
	"projects - Projects and research",
	"portfolio - Some of my works",
	"facebook - My facebook profile",
	"twitter - My twitter account",
	"kpbr - Katy Perry Brasil",
	"pd - Portal Duff",
	"help - List of available commands",
	"theme - Change the terminal theme",
	"clear - Clear terminal screen",
	"refresh - Reload terminal",
	"reset - Reset preferences and reload terminal",
	"whoami - View current user",
	//"elisa",
	//"gabi",
	//"rubens",
	"ping"
	);
	
	target = $("#console");
	current_line = 0;
	command = "";
	prev_command = "";
	available = true;
		
	$("body").keypress(function(event) {
		//event.preventDefault();
		if (!available) return;	
		typed_char = String.fromCharCode(event.keyCode);
		command = command.concat(typed_char);
		update_line();
	});
	
	$("body").keydown(function(event) {
		if (!available) return;
		switch (event.keyCode) {
			// backspace
			case 8:
				if(!isMobile.any()) {
					event.preventDefault();
					command = command.substr(0, command.length-1);
				}
				update_line();
				break;
			// enter
			case 13:
				if (isMobile.any()) {
					command = $("#fakeinput").val();
				} else {
					event.preventDefault();
				}
				eval_command();
				break;
			// up
			case 38:
				command = prev_command;
				update_line();
				break;
			// down
			case 40:
				command = "";
				update_line();
				break;
			default:
				//console.log(event.keyCode);
		}
	});
	
	function update_line() {
		if (!isMobile.any()) {
			target_line.html(init_text + " " + command + "<span id=\"cursor\">" + cursor + "</span>");
		} else {
			target_line.html(init_text + " <input type=\"text\" id=\"fakeinput\" autocapitalize=\"off\" autocorrect=\"off\" value=\"tap here to type\" />");
		}
	}
	
	function new_line() {
		$("#cursor").detach();
		current_line++;
		target.append("<div id=\"line_" + current_line + "\"></div>\n");
		target_line = $("#line_" + current_line);
		update_line();
		$('html, body').animate({ scrollTop: $(document).height() }, 0);
	}

	function eval_command() {
		//console.log("Command: '" + command.valueOf() + "'");
		argv = command.split(" ");
		argc = argv.length;
		
		switch (argv[0]) {
			case "":
				break;
			case "help":
			case "?":
				help();
				break;
			case "email":
				stdout("macecchi@gmail.com");
				break;
			case "about":
				stdout("Mário Cecchi");
				break;
			case "elisa":
				stdout("vai tomar no koo");
				break;
			case "gabi":
				stdout("curte um mc xereca");
				break;
			case "rubens":
				stdout("ama cavalos");
				break;
			case "kpbr":
				redirect("http://www.katyperry.com.br/");
				return;
			case "pd":
			case "hdbr":
				redirect("http://www.hilaryduff.com.br/");
				return;
			case "facebook":
				redirect("https://www.facebook.com/macecchi");
				return;
			case "twitter":
				redirect("http://twitter.com/MarioCecchi");
				return;
			case "jonas":
				redirect("http://meriw.com/22");
				return;
			case "projects":
				stdout("Soon.");
				break;
			case "portfolio":
				stdout("Soon.");
				break;
			case "ping":
				stdout("Pong!");
				break;
			case "bye":
				exit();
				return;
			case "whoami":
				stdout(my_ip());
				break;
			case "welcome":
				stdout("<span class=\"welcome\">" + welcome_text + "</span>");
				break;
			case "refresh":
				redirect("");
				return;
			case "reset":
				eraseCookie("meriw_theme");
				redirect("");
				return;
			case "clear":
				target.empty();
				break;
			case "theme":
				if (argc > 1) {
					switch (argv[1]) {
						case "homebrew":
						case "basic":
							$("body").removeClass();
							$("body").addClass(argv[1]);
							createCookie("meriw_theme", argv[1]);
							break;
						default:
							stdout("Invalid theme option.");
					}
				} else {
					stdout("usage: theme THEME_NAME\nAvailable themes:\n homebrew (default)\n basic");
				}
				break;
			case "cd":
				if (argc > 1) {
					redirect(argv[1]);
					return;
				}
				stdout("usage: cd DIRECTORY");
				break;
			default:
				stdout(command + ": command not found");
		}
		
		prev_command = command;
		command = "";
		new_line();
	}
	
	function stdout(msg) {
		target.append("<span class=\"response\">" + msg + "</span>");
	}
	
	function help() {
		stdout("Available commands:\n");
		for (i=0; i<available_commands.length; i++) {
			stdout("  " + available_commands[i] + "\n");
		}
		//stdout("Total: " + available_commands.length + "");
	}
	
	function redirect(url) {
		if (url == "") {
			target.append("=> Reloading this page.");
			document.location.reload(true);
		} else {
			target.append("=> Redirecting to " + url + ". Loading.");
			self.location.href = url;
		}
		setInterval(function() { target.append("."); }, 100);
	}
	
	function exit() {
		stdout("Goodbye!");
		available = false;
		$("#cursor").detach();
		setTimeout(function() { window.close() }, 1000);
	}
		
	// Init
	theme = (readCookie("meriw_theme")!=null) ? readCookie("meriw_theme") : default_theme;
	$("body").addClass(theme);
	stdout("<span class=\"welcome\">" + welcome_text + "</span>");
	
	if(isMobile.any()) {
		$("head").append("<meta content='width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' name='viewport'>\n<meta content='yes' name='apple-mobile-web-app-capable'>");
		stdout("<span class=\"welcome\">\nNOTICE: This app probably won't work on your device.</span>");
		
		//$('#fakeinput').focus().blur().focus();

	}

	new_line();
	setInterval(function() { $("#cursor").toggle(); }, 500);

});

function my_ip() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(": ");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
