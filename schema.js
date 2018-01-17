const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require("graphql");

const users = [
  { id: 1, firstName: 'Tom', lastName: 'Smith' },
  { id: 2, firstName: 'Anna', lastName: 'Jones' },
];

const posts = [
  { id: 1, userId: 1, title: 'Hello', votes: 2 },
  { id: 2, userId: 2, title: 'GraphQL', votes: 3 },
];

let getUser = id => users.find(user => user.id === id);
let getPost = id =>  posts.find(post => post.id === id);
let getPosts = userId => (userId ? posts.filter(post => post.userId === userId) : posts);

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "...",

  fields: () => ({
    id: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return getUser(parent.userId)
      }
    },
    title: { type: GraphQLString },
    votes: { type: GraphQLInt }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  description: "...",

  fields: {
    id: { type: GraphQLInt },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return getPosts(parent.id)
      }
    }
  }
})

const queryFields = {
  user: {
    type: UserType,
    args: {
      id: { type: GraphQLInt }
    },
    resolve(parent, args) {
      return getUser(args.id);
    }
  },
  posts: {
    type: new GraphQLList(PostType),
    resolve: getPosts
  }
}

const mutationFields = {
  upvotePost: {
    type: PostType,
    args: {
      id: { type: GraphQLInt }
    },
    resolve(parent, args) {
      const post = getPost(args.id);
      if (!post) {
        throw new Error("No posts with id '${postId}'");
      }
      post.votes += 1;
      return post;
    }
  }
}

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "...",
  fields: queryFields
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "...",
  fields: mutationFields
});

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});

module.exports = schema;
