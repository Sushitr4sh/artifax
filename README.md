## About The Project

![project picture](https://res.cloudinary.com/dysmngiix/image/upload/v1698127243/YelpCamp/Screenshot_2023-10-24_125419_tzduos.png)

Artifax is a web based generative AI application that turns users input to an actual image, which is powered by one of Amazon Bedrock's' foundation model - Stable Diffusion XL developed by Stability AI.

### Build With:

This project is built upon Node.js with several of its packages including:

* Express: A fundamental Node.js web application framework for building robust and efficient web applications.
* Express-Session: Middleware for handling user sessions and managing user data across requests.
* Mongoose: A versatile ODM (Object Data Modeling) library for MongoDB, making database interactions more intuitive.
* Connect-Mongo: A session store for Express, essential for storing session data in a MongoDB database.
* Express-Mongo-Sanitize: Preventing NoSQL injection attacks when working with MongoDB
* AWS SDK: Integration of Amazon Web Services SDK for handling AWS resources and services.
* Passport/Passport-Local: A highly trusted authentication middleware for Node.js, providing security and user authentication functionalities (authenticating with a username and password) .
* EJS/EJS-Mate: A templating language and engine for dynamic HTML content generation.
* Helmet: A security middleware that adds an additional layer of protection by setting HTTP headers.
* Joi: A validation library to ensure that incoming data complies with specified rules, enhancing the integrity of the application.
* Sanitize-HTML: A package that prevents cross-site scripting (XSS) attacks by sanitizing HTML input.
* Etc...

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## System Architecture Design 
![System Architecture](https://res.cloudinary.com/dysmngiix/image/upload/v1698137383/YelpCamp/Cloud_Architecture_pzwhc8.png)

The diagram above illustrates the path data follows, originating from users, passing through the Node.js application, navigating through the cloud architecture, and finally returning to the user.

* When a user initially submits their prompt via an HTML form, it triggers a POST request. This request is intercepted and processed by Express. Express subsequently extracts the incoming prompt data from the request body and forwards it as parameters to invoke the Lambda function.

* Lambda, in turn, establishes a Boto3 client configuration to facilitate interactions with an AWS service, specifically the "bedrock" service. It then dispatches an API request to the Stable Diffusion model, including the user's prompt. The model, in response, generates an image corresponding to the user's prompt in base64 format.

* Upon receiving the model's response, Lambda proceeds to set up an S3 client and specifies the destination S3 bucket where the image will be stored. It also constructs the file name and URL for the image. Following this, Lambda converts the image into the PNG format and uploads it to the designated S3 location.

* Subsequently, Lambda returns the image's URL and filename to Express. Express, upon receiving this response, stores it in our cloud-based Mongo Atlas Database. Finally, the image is rendered and displayed to the user through the EJS template, completing the user's interaction with the application.

### End User's Workflow
1. Upon launching the web application, whether accessed through the hosted URL or locally, users will be directed to the homepage. Here, users have the option to either sign in (if they already possess an account) or sign up. Depending on their choice, they are required to complete the relevant form for authentication or registration, or alternatively, they can opt to proceed as a guest.

   **Home page:**

   ![Home page](https://res.cloudinary.com/dysmngiix/image/upload/v1698140574/YelpCamp/Screenshot_2023-10-24_163837_f2boal.png)

   **Log-in page:**

   ![Login page](https://res.cloudinary.com/dysmngiix/image/upload/v1698140574/YelpCamp/Screenshot_2023-10-24_163854_nf5cdb.png)

   **Sign-up page:**

   ![Sign-up page](https://res.cloudinary.com/dysmngiix/image/upload/v1698140574/YelpCamp/Screenshot_2023-10-24_163906_gr5lnr.png)

2. If the guest option is selected, users will be redirected to the playground page. Here, they can experiment with the application's features by simply entering a prompt and clicking "generate." The generated 
   image then is displayed for them. However, it's important to note that if the guest chooses this path, they won't be able to save the image, as it will be deleted upon page refresh.

   **Guest playground:**
   
   ![Guest](https://res.cloudinary.com/dysmngiix/image/upload/v1698140573/YelpCamp/Screenshot_2023-10-24_163938_ta1kek.png)

   ![Guest prompt result](https://res.cloudinary.com/dysmngiix/image/upload/v1698140574/YelpCamp/Screenshot_2023-10-24_163959_lehfsr.png)

4. For users opting to sign up, they must fill out the username, email, and password fields. Subsequently, they are automatically redirected to the main app page. Users selecting the login option are prompted to enter their username and password for their registered account, after which they, too, are directed to the main app page.

5. Upon a successful login, users access the main app page, which closely resembles the functionality of Chat GPT. Their first task is to create a new chat and assign it a name, serving as a container for storing their prompt and image data history. Afterward, users are redirected to the chat container and can begin entering prompts. Within seconds, the application responds to the user's prompt by generating an image based on the input.

   **Main page:**

   ![Main page](https://res.cloudinary.com/dysmngiix/image/upload/v1698140574/YelpCamp/Screenshot_2023-10-24_164034_sfgvun.png)

   **Creating new chat container:**

   ![Chat navigation](https://res.cloudinary.com/dysmngiix/image/upload/v1698140574/YelpCamp/Screenshot_2023-10-24_164056_vuwqgg.png)

   ![New chat](https://res.cloudinary.com/dysmngiix/image/upload/v1698140573/YelpCamp/Screenshot_2023-10-24_164108_ud0icy.png)

   ![Created chat](https://res.cloudinary.com/dysmngiix/image/upload/v1698140573/YelpCamp/Screenshot_2023-10-24_164122_kkcxkf.png)

   **Creating image based on user prompt:**

   ![User prompt](https://res.cloudinary.com/dysmngiix/image/upload/v1698140572/YelpCamp/Screenshot_2023-10-24_164154_rqbugq.png)

   ![Response](https://res.cloudinary.com/dysmngiix/image/upload/v1698140573/YelpCamp/Screenshot_2023-10-24_164225_nhbshw.png)

   > [!NOTE]
   > Generating an image may require approximately 10 to 15 seconds to complete.

### Additional Functionality

* This application is designed with responsive design in mind, ensuring that it can adapt to various screen sizes, including mobile devices, by adjusting its layout accordingly.

* **Prompt Edit:** You have the flexibility to make edits to your prompt after sending it, rather than sending a new prompt, thus avoiding unnecessary expansion of the chat container, by clicking the edit image beside the prompt.

   ![Edit Prompt](https://res.cloudinary.com/dysmngiix/image/upload/v1698142815/YelpCamp/Screenshot_2023-10-24_171936_uggkjh.png)

* **Image Regeneration:** If you wish to generate a new image based on the same prompt, you can simply click the "regenerate" button. However, it's important to note that the new image will only give slight change from the original. See the example below:

   Original image:

   ![Original image](https://res.cloudinary.com/dysmngiix/image/upload/v1698142821/YelpCamp/image_ptlo8i.png)

   Regenerated image:

   ![Regenerated image](https://res.cloudinary.com/dysmngiix/image/upload/v1698142821/YelpCamp/image2_fsbqe6.png)

* **Prompt Deletion:** You can delete a prompt which will also delete associated image if you don't need it anymore by clicking the delete button beside the regenerate button

## Secuirty Consideration

Artifax comes with some built in security features that are incorporated within several of the Node.js packages it utilizes.

* **Secure User Authentication & Registration With Passport.js:** Passport employs an automatic hashing process to secure the passwords of registered users and assigns a salt for added protection. Passport also conducts checks to prevent the use of duplicate usernames or emails, ensuring the uniqueness of user information and maintaining the integrity of the registration process.

   example of a registered user stored on the database:

   ![Password hash & salt](https://res.cloudinary.com/dysmngiix/image/upload/v1698144127/YelpCamp/Screenshot_2023-10-24_174128_djjy33.png)

* **Data Validation With JOI:** Make certain that incoming data adheres to predefined rules (min, max, alphanum, pattern, string, required, etc), preventing the input of empty or arbitrary data via Postman or other sources.

* **HTML Sanitize to Prevent XSS:** An extension for JOI designed to verify whether a user-input string contains HTML code or not.

* **Resistant to MongoDB Injection With Express-Mongo-Sanitize:** This module scans for keys within objects originating from req.body, req.query, or req.params, which either start with a $ sign or contain a ".", and it offers two options:

   -Completely eliminate these keys and their associated data from the object.

   -Substitute the restricted characters with a permissible character.

* **Secure Express Apps by Setting HTTP Response Headers Using Helmet:**
  
   Default HTTP headers before using helmet:

   ```sh
   $ curl http://localhost:8080 --include
   HTTP/1.1 200 OK
   X-Powered-By: Express
   Content-Type: text/html; charset=utf-8
   Content-Length: 3222
   ETag: W/"c96-RGl5rhV52vUidBNFvUuMUcw+8X0"
   Set-Cookie: session=s%3AMK77XsManEw5Fxx5yBBYXztIZq9SeIIp.RzuQwlfSfMKyjyLgEm6HTstRR21yhco3YcOV2q53k1g; Path=/; Expires=Tue, 31 Oct 2023 15:18:46 GMT; HttpOnly
   Date: Tue, 24 Oct 2023 15:18:46 GMT
   Connection: keep-alive
   Keep-Alive: timeout=5
   ```

   Prior to implementing Helmet, the X-Powered-By header is visible, providing information about the technologies employed by the webserver. This disclosure can potentially facilitate the identification of vulnerabilities by attackers.

   Using helmet:

   ```sh
   $ curl http://localhost:8080 --include
   HTTP/1.1 200 OK
   Content-Security-Policy: default-src;connect-src 'self';script-src 'unsafe-inline' 'self' https://code.jquery.com/ https://fonts.googleapis.com/;style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/;worker-src 'self' blob:;object-src;img-src 'self' blob: data: https://s3.amazonaws.com/stabled.response/;base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';script-src-attr 'none';upgrade-insecure-requests
   Cross-Origin-Opener-Policy: same-origin
   Cross-Origin-Resource-Policy: same-origin
   Origin-Agent-Cluster: ?1
   Referrer-Policy: no-referrer
   Strict-Transport-Security: max-age=15552000; includeSubDomains
   X-Content-Type-Options: nosniff
   X-DNS-Prefetch-Control: off
   X-Download-Options: noopen
   X-Frame-Options: SAMEORIGIN
   X-XSS-Protection: 0
   Content-Type: text/html; charset=utf-8
   Content-Length: 3222
   ETag: W/"c96-RGl5rhV52vUidBNFvUuMUcw+8X0"
   Set-Cookie: session=s%3A37ydfBtTcQThYXy4tVVhqItzalz-Xfzf.bzdj9mg%2FHmoCDrRN0zp55g8gio3rwLJxXAxA7ysKb4c; Path=/; Expires=Tue, 31 Oct 2023 15:21:39 GMT; HttpOnly
   Date: Tue, 24 Oct 2023 15:21:39 GMT
   Connection: keep-alive
   Keep-Alive: timeout=5
   ```

   -After using Helmet middleware, it hides X-Powered-By header and sets some of the following headers:

   -Content-Security-Policy: A powerful allow-list of what can happen on your page which mitigates many attacks

   -Cross-Origin-Opener-Policy: Helps process-isolate your page
 
   -Cross-Origin-Resource-Policy: Blocks others from loading your resources cross-origin

   -Origin-Agent-Cluster: Changes process isolation to be origin-based

   -Referrer-Policy: Controls the Referer header

   -Strict-Transport-Security: Tells browsers to prefer HTTPS

   -X-Content-Type-Options: Avoids MIME sniffing

   -X-DNS-Prefetch-Control: Controls DNS prefetching

   -X-Download-Options: Forces downloads to be saved (Internet Explorer only)

   -X-Frame-Options: Mitigates clickjacking attacks

## Getting Started

Below list some way of how you can access/run this project:

* Access via Hosted URL:

   You can view a hosted instance of this project by visiting the following URL: : https://artifax-g2l4jt0rq-sushitr4sh.vercel.app/

   If you're experiencing this kind of error when exploring the hosted version of this project:

   ![Vercel Error](https://res.cloudinary.com/dysmngiix/image/upload/v1698162261/YelpCamp/Screenshot_2023-10-24_184337_bx3x8m.png)

   This issue is originating from Vercel which may be related to your internet connection, please refresh the page and it should be working as it should.

* Run the Project Locally on Your Machine:

   This is the recommended way to access the project:

1. Clone the repo

   ```sh
   git clone https://github.com/Sushitr4sh/artifax.git
   ```
   
2. Install NPM packages
      
   ```sh
   npm i //or
   npm install
   ```
   
3. Start the App
      
   ```sh
   npm start //or
   node app.js //or
   nodemon app.js 
   ```
   
4. Access the app on your browser
   After you see the port number (8080) and database connected printed out, you can now open your browser and navigate to http://localhost:8080 to access the project

* **Customizing Style:** Styling in this project primarily relies on pre-built classes from Tailwind CSS. If you wish to modify the style, you can run the following command:
  
    ```sh
    npx tailwindcss -i ./src/input.css =o ./public/stylesheets/output.css --watch.
    ```
    
    This command will include all the classes found in your EJS document and remove any classes that are not present in the project.


  
