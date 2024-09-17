# Deploy to Google Cloud

## Introduction

In this tutorial you will learn how to deploy a full-stack application to the
cloud.

The 3 big cloud providers are AWS, Azure and Google Cloud (GCP).
I had to choose one for this guide, so I went with Google Cloud.
The way deployment is done differs some between cloud providers, but the
broad concepts are transferable.
I believe that learning how to set it up on one provider will make it easier to
figure out on another.

The tutorial is split into two parts.
They are indented to be completed in order.

## Prerequisites

### Google Cloud CLI

You need to set up the CLI tool for Google Cloud, if you haven't already.

[Install the gcloud CLI](https://cloud.google.com/sdk/docs/install)

Then run this command in your terminal:

```sh
gcloud init
```

### Firebase CLI

- [Install the Firebase CLI](https://firebase.google.com/docs/cli/#install_the_firebase_cli)

Then login with:

```sh
firebase login
```

### Database

You will need PostgreSQL database instance that are accessible online.

You could create one for free over at [aiven](https://aiven.io/).
Or, if you don't mind spending some of your credit, you could create a Cloud SQL
instance on Google Cloud.

_Note: for production use it is a good idea to use the same hosting provider._

You need a connection string to connect to the database.
When you create your database, you will likely see the connection string it in
URI format.

```
jdbc:username@password://hostname:5432/database?sslmode=require
```

Or:

```
jdbc:postgresql://hostname:5432/database?ssl=require&user=username&password=password
```

In .NET, a connection string is specified differently.

```
Server=hostname;DB=database;UID=username;PWD=password;PORT=5432;SslMode=require
```

Notice that you got a hostname, database, username and password in both cases.

You will need to be able to convert the connection string you get from your
database host to .NET format.

## Getting started

1. Click on the green "Use this template" button at the top
2. Then select "Create a new repository"

![Use this template screenshot](https://docs.github.com/assets/cb-76823/mw-1440/images/help/repository/use-this-template-button.webp)

3. Click "Create repository from template"
4. Type a repository name and click "Create Repository"
5. Make a local clone the repository following the instructions [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
6. Open your local clone in WebStorm, Rider or another editor

## Prepare the back-end

For the setup to work, you need to add this to the `Program.cs` file.

```cs
using Microsoft.AspNetCore.HttpOverrides;

// Just below the line that says:
// var app = builder.Build();
// Add this:

app.UseForwardedHeaders(
    new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    }
);
```

This is needed to the back-end will respond correctly to forwarded requests.

## Part 1 - Build container locally

For the **back-end** you will build a container image on you local machine.
Then push the image to Artifact Registry and deploy to Cloud Run.

For the **front-end** you will build the front-end locally and then deploy to
Firebase Hosting.

**[Follow instructions here](./docs/local.md)**

## Part 2 - Continuous delivery

In this part you will do something similar, but the focus will automation.
You will learn how to do deployment in a way that can be built into a CI/CD
pipeline/workflow.

Automating the deployment process makes sure that deployments are done
consistently.
It also enables the deployment of new features quicker, provided there is good
quality control in place.

**[Follow instructions here](./docs/cd.md)**

## Clean up

After you have completed both parts, it might be a good idea to clean up the
resources that you've created during this guide.

Resources created are:

- [Cloud Run service](https://console.cloud.google.com/run)
- [Cloud Build trigger](https://console.cloud.google.com/cloud-build/triggers)
- [Artifact Registry repository](https://console.cloud.google.com/artifacts)
- [Firebase Project](https://console.firebase.google.com/)
- [Secret Manage secret (AppDb)](https://console.cloud.google.com/security/secret-manager)
- [IAM service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
- Your clone of the repository

If you are not using the Google Cloud project on for anything else, then you
could just remove the entire project.

You can find an overview of the resources you use at Google Cloud in the [Asset Inventory](https://console.cloud.google.com/iam-admin/asset-inventory/dashboard)

If you don't want to use Cloud Build again, consider removing Google Cloud
Build from your [Authorized GitHub
Apps](https://github.com/settings/apps/authorizations).

## Closing thoughts

Manually deploying an application can be tedious and error-prone.
It is therefore a good idea to automate the process.

It is also possible to use GitHub Actions for automated deployment instead of Cloud Build.
[See example](https://github.com/google-github-actions/example-workflows/blob/main/workflows/deploy-cloudrun/cloudrun-docker.yml).
