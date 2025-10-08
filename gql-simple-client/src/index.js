import { gql, request } from "graphql-request";

const getUsers = gql`
  {
    users {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const getPosts = gql`
  {
    posts {
      edges {
        node {
          id
          title
          author {
            name
          }
        }
      }
    }
  }
`;

request("http://localhost:4000/graphql", getUsers).then((res) => {
  let html = "";

  for (const edge of res.users.edges) {
    const user = edge.node;
    html += `<div>${user.name}</div>`;
  }

  document.getElementById("users").innerHTML = html;
});

request("http://localhost:4000/graphql", getPosts).then((res) => {
  let html = "";

  for (const edge of res.posts.edges) {
    const post = edge.node;
    html += `
    <div>
      <h1>${post.title}</h1>
      <h2>${post.author.name}</h2>
    </div>`;
  }

  document.getElementById("posts").innerHTML = html;
});
