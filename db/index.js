import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

const typeDefs = `#graphql
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
`;