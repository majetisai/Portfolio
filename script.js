function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var name = data.name || "No name";
    var email = data.email || "No email";
    var message = data.message || "No message";
    var timestamp = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([timestamp, name, email, message]);

    var subject = "New Portfolio Contact: " + name;
    var emailBody = "You received a new message from your portfolio website!\n\n"
      + "Name: " + name + "\n"
      + "Email: " + email + "\n"
      + "Time: " + timestamp + "\n\n"
      + "Message:\n" + message + "\n";

    GmailApp.sendEmail(
      "manikanta1234majeti@gmail.com",
      subject,
      emailBody,
      {replyTo: email}
    );

    return ContentService
      .createTextOutput(JSON.stringify({"success": true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({"success": false, "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({"status": "active"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function testSetup() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message."
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}
