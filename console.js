// By Mario Cecchi (macecchi@gmail.com)
// http://meriw.com

$(document).ready(function() {
	init_text = '<span class="user">visitor</span>@<span class="host">meriw:</span><span class="path">/</span>$';
	version = '0.3';
	cursor = '&nbsp;';
	default_theme = 'solarized-dark';
	welcome_text = "Welcome to meriw (version " + version + ")\n\This is the personal website of Mario Cecchi.\nEnter 'help' to view the menu.\n ";
	
	available_commands = new Array(
		["about", "About me", function(){ stdout("Mario Cecchi.\n\n\
22-year-old Computer Science student at Federal University of Rio de Janeiro (UFRJ), Brazil.\n\
I also work as an undergraduate researcher at the Computational Intelligence Laboratory, UFRJ.\n\
In my spare time, I code and manage a few websites and some personal projects.\n\
My biggest interest is in mobile and web development.\n\
\n\
Please find more about what I do through the 'projects' menu.\n\n\
The code for this Terminal-style page is available on my GitHub at https://github.com/macecchi/macecchi.github.io.\n") }],
		["email", "My email", function(){ stdout("Feel free to contact me at macecchi@gmail.com.") }],
		["projects", "Projects and research", function() { stdout("\
Please refer to my GitHub page for information about my projects.\n\
https://github.com/macecchi (or run	 'github')\n")}],
		["github", "My GitHub account", function() { redirect("https://github.com/macecchi"); }],
		["linkedin", "My Linkedin profile", function() { redirect("https://br.linkedin.com/pub/mario-cecchi-raduan/71/757/124"); }],
		["lattes", "My Lattes CV", function() { redirect("http://lattes.cnpq.br/2694166859171258"); }],
		["facebook", "My Facebook profile", function() { redirect("https://www.facebook.com/macecchi"); }],
		["twitter", "My Twitter profile", function() { redirect("https://twitter.com/MarioCecchi"); }],
		["theme", "Change the terminal theme", function() {
			if (argc > 1) {
					switch (argv[1]) {
						case "solarized-dark":
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
					stdout("usage: theme <THEME_NAME>\nAvailable themes:\n solarized-dark (default)\n homebrew\n basic");
				}
		}],
		["clear", "Clear terminal screen", function() { target.empty(); }],
		["refresh", "Reload terminal", function() { redirect(""); }],
		["reset", "Reset terminal", function() { 
			eraseCookie("meriw_theme");
			redirect(""); }],
		// ["exit", "Terminate session", exit],
		["ip", "Current IP address", function() { stdout(my_ip()); }]
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
		target_line.html(init_text + " " + command + "<span id=\"cursor\">" + cursor + "</span>");

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
		argv = command.split(" ");
		argc = argv.length;
		
		switch (argv[0]) {
			case "":
				break;
			case "help":
			case "?":
				help();
				break;
			case "cd":
				if (argc > 1) {
					redirect(argv[1]);
					return;
				}
				stdout("usage: cd [DIRECTORY]");
				break;
			default:
				for (i=0; i < available_commands.length; i++) {
					cmd = available_commands[i];

					if (cmd[0] == argv[0]) {
						cmd[2]();
						break;
					}
				}

				if (i == available_commands.length)
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
			cmd = available_commands[i];
			stdout("	" + cmd[0] + " - " + cmd[1] + "\n");
		}	}
	
	function redirect(url) {
		if (url == "") {
			stdout("=> Reloading this page.");
			document.location.reload(true);
		} else {
			stdout("=> Redirecting to " + url + ". Loading...");
			self.location.href = url;
		}	}
	
	function exit() {
		stdout("Goodbye!");
		available = false;
		$("#cursor").detach();
		setTimeout(function() { window.close() }, 1000);
	}
		
	// Init
	theme = (readCookie("meriw_theme") != null) ? readCookie("meriw_theme") : default_theme;
	$("body").addClass(theme);
	stdout("<span class=\"welcome\">" + welcome_text + "</span>");
	
	if (isMobile.any()) {
		$("head").append("<meta content='width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' name='viewport'>\n<meta content='yes' name='apple-mobile-web-app-capable'>");
		stdout("<span class=\"welcome\">\nPlease use your computer to access this website.\n</span>");
		
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
