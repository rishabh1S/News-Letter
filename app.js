import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mailchimp from "@mailchimp/mailchimp_marketing";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
    apiKey: "c8105dd0228da1a8f0da6c772091e690-us21",
    server: "us21"
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {

    const listId = "e3190d93a1";
    const subscribingUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });

            console.log(
                `Successfully added contact as an audience member. The contact's id is ${response.id}.`
            );

            res.sendFile(__dirname + "/success.html");
        } catch (e) {
            res.sendFile(__dirname + "/failure.html");
        }
    }

    run();
}) 

app.post("/failure", function (req, res) {
    res.redirect("/");
})



app.listen(process.emv.PORT || 3001, () => {
    console.log("Server is running on port 3001");
})

