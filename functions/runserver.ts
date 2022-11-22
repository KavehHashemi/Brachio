const runServer = () => {
  var oShell = new ActiveXObject("Shell.Application");
  var commandtoRun = ".\\server\\nats-server";
  oShell.ShellExecute(commandtoRun, "", "", "open", "1");
};
