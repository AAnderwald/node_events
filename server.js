import fs from "fs";                                                            //getting started 1-4
import http from "http";
import path from "path";
import {EventEmitter} from "events";

const NewsLetter = new EventEmitter ();                                         //5. Using the EventEmitter class, create a new EventEmitter instance called “NewsLetter”

http.createServer((request, response) =>                                        //6. Instantiate a new server instance with createServer
{
    const {url, method} = request;                                              //7. Inside the server request handler, listen for the ‘data’ event to be emitted, and pass in a callback function that pushes each ‘chunk’ into an array named ‘chunks’
    const chunks = [];                         

    request.on("data", (data) => chunks.push(data));
    
    request.on("end", () =>                                                     //8. Listen for the request ReadStream ‘end’ event, and pass in a callback that contains a conditional statement (if/else)
    {
        if (url == "/newsletter_signup" && method == "POST") 
        { 
        let {name, email} = JSON.parse(Buffer.concat(chunks).toString());           //9. The conditional statement will check the request url and method, and if they are “POST” and “/newsletter_signup”, decode the chunks array with Buffer.concat().toString(), and use JSON.parse() on the result to access the request body values
        NewsLetter.emit("signup", `\n"${name}","${email}"`);                        //10. Next, emit a ‘signup’ event, and pass in the value to be used by your event listener callback (name + email for csv record)
        response.writeHead(200, {"Content-Type": "application/json"});       
        response.write(JSON.stringify({message: "Congrats you are now signed up"}));  //11. Write and end the response to the client
        response.end();
    } else {                                                                    //12. Account for any method or url that is not “POST” + “/newsletter_signup”
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not Found");
        response.end();
        }
    });
})                                      
.listen(3000, () => console.log (" Server listening on port 3000 . ."));


NewsLetter.on("signup", (contact) =>                                            //13. Outside of your server request handler, add an event listener for a ‘signup’ event on the NewsLetter EventEmitter
{                                                                               //14. Pass in a callback that takes in a ‘contact’ as a parameter
    fs.appendFile(path.join(process.cwd(), "/newsletter.csv"), contact, (error) => //15. This function should use fs.appendFile() to add the contact to a csv file in your project directory 
    {
        if(error){                                                              //16. Account for errors
            console.error(error);
        } else {
            console.log("This was a success");
        }
    });
});