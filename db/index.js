import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import "dotenv/config";
// require("dotenv").config();

// graphql types
const typeDefs = `
    type Recipe {
    id: ID!
    name: String!
    description: String
    ingredients: [Ingredient!]! @relationship(type: "REQUIRES", direction: OUT)
    steps: [Step!]! @relationship(type: "PREPARED_IN", direction: OUT)
    media: [Media!]! @relationship(type: "HAS_MEDIA", direction: OUT)
    comments: [Comment!]! @relationship(type: "HAS_COMMENT", direction: OUT)
    author: User! @relationship(type: "CREATED_BY", direction: OUT)
    }
    
    type Ingredient {
    id: ID!
    name: String!
    recipes: [Recipe!]! @relationship(type: "REQUIRES", direction: IN)
    }
    
    type Step {
    id: ID!
    description: String!
    order: Int!
    recipe: Recipe! @relationship(type: "PREPARED_IN", direction: IN)
    }
    
    type Media {
    id: ID!
    url: String!
    type: MediaType!
    recipe: Recipe! @relationship(type: "HAS_MEDIA", direction: IN)
    comment: Comment! @relationship(type: "HAS_MEDIA", direction: IN)
    }
    
    enum MediaType {
    IMAGE
    VIDEO
    }
    
    type Comment {
    id: ID!
    text: String!
    media: [Media!]! @relationship(type: "HAS_MEDIA", direction: OUT)
    recipe: Recipe! @relationship(type: "HAS_COMMENT", direction: IN)
    author: User! @relationship(type: "WROTE", direction: OUT)
    }
    
    type User {
    id: ID!
    name: String!
    recipes: [Recipe!]! @relationship(type: "CREATED_BY", direction: IN)
    comments: [Comment!]! @relationship(type: "WROTE", direction: IN)
    }

    type Query {
        recipe(id: ID!): Recipe
        recipes: [Recipe!]!
        ingredient(id: ID!): Ingredient
        ingredients: [Ingredient!]!
        step(id: ID!): Step
        steps: [Step!]!
        media(id: ID!): Media
        medias: [Media!]!
        comment(id: ID!): Comment
        comments: [Comment!]!
        user(id: ID!): User
        users: [User!]!
    }
    
    type Mutation {
        createRecipe(name: String!, description: String, ingredients: [ID!]!, steps: [ID!]!, media: [ID!]!, authorId: ID!): Recipe
        updateRecipe(id: ID!, name: String, description: String): Recipe
        deleteRecipe(id: ID!): Recipe
        
        createIngredient(name: String!): Ingredient
        updateIngredient(id: ID!, name: String): Ingredient
        deleteIngredient(id: ID!): Ingredient
        
        createStep(description: String!, order: Int!, recipeId: ID!): Step
        updateStep(id: ID!, description: String, order: Int): Step
        deleteStep(id: ID!): Step
        
        createMedia(url: String!, type: MediaType!, recipeId: ID, commentId: ID): Media
        updateMedia(id: ID!, url: String, type: MediaType): Media
        deleteMedia(id: ID!): Media
        
        createComment(text: String!, media: [ID], recipeId: ID!, authorId: ID!): Comment
        updateComment(id: ID!, text: String): Comment
        deleteComment(id: ID!): Comment
        
        createUser(name: String!): User
        updateUser(id: ID!, name: String): User
        deleteUser(id: ID!): User
    }
`;

// require("dotenv").config();
// const { ApolloServer } = require("apollo-server");
// const { Neo4jGraphQL } = require("@neo4j/graphql");
// const neo4j = require("neo4j-driver");

// Load environment variables
const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;

// Connect to Neo4j database
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

// Instantiate Neo4jGraphQL with the defined schema and Neo4j driver
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

// Set up the ApolloServer with the generated schema and context
const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
    introspection: true,
    playground: true,
    context: ({ req }) => {
        return {
            driver, // Passing the Neo4j driver to the context
        };
    },
});

server.applyMiddleware({ app });
// Start the server
app.listen({ port: 4000 })
    .then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    })
    .catch((err) => {
        console.error("Error starting server:", err);
    });

// neo4j driver + graphql integration
// const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

// const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

// // apollo server setup
// const server = new ApolloServer({
//     schema: await neoSchema.getSchema(),
//     introspection: true,
//     playground: true,
//     context: ({ req }) => {
//         return {
//             driver: neo4jDriver,
//         };
//     },
// });

// const { url } = await startStandaloneServer(server, {
//     context: async ({ req }) => {
//         // console.log(req); // Log the request to the console
//         return { req };
//     },
//     listen: { port: 4000 },
// });

// console.log(`🚀 Server ready at ${url}`);
