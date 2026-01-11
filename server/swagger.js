const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "Documentation for a Todo Application",
        description: "Documentation for the backend of a todo application, as part of the Course Assignment in REST API"
    },
    securityDefinitions: {
        BearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter: "Bearer {token}. Log in ang get the token from the login response."'
        }
    },
    definitions: {
        Login: {
            $email: "ola@email.com",
            $password: "sECRET"
        },
        Signup: {
            $firstName: "Ola",
            $lastName: "Nordmann",
            $email: "ola@email.com",
            $password: "sECRET"
        },
        PostCategory: {
            $name: "Housework",
        },
        PutCategory: {
            $newName: "Important housework"
        },
        PostTodo: {
            $name: "Clean bathroom",
            $description: "Clean the bathroom on friday, before the weekend starts",
            $CategoryId: "1",
            $StatusId: "1"
        },
        PutTodo: {
            $newName: "Study for exams",
            $newDescription: "Read chapter 2",
            $newCategoryId: "2",
            $newStatusId: "2"
        }
    },
    
}

const outputfile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputfile, endpointsFiles, doc).then(() => {
    require('./bin/www')
});