# Bojagi - Bring your designers to code review ✅

<img src="https://bojagi.io/images/bojagi-logo-full.svg" alt="Bojagi Logo" height="140" />

[Documentation](https://bojagi.io/docs) ◆ [Bojagi Website](https://bojagi.io) ◆ [Join the open beta](https://bojagi.io/register)

## 💁‍♀️ What is Bojagi?

Bojagi is a service to review your UI changes visually. We are connected to your repository on GitHub and render 
your components in real time. This way your teammates or designer can review the visual changes and play around
with your component. It's like hosting your Storybook, but more interactive.

Bojagi is currently in open beta, [join here!](https://bojagi.io/register)

## 🏆 Why use Bojagi?

Bojagi reduces your development cycle times by removing the back and forth of reviewing your UI designs on your
development environment.

* No more waiting until you deployed to staging or QA, do it before you merge to master! 🏃‍♀️
* Reduce communication effort: write comments, mark proposed changes visually and quickly give feedback 🚦
* Present your components to peers and customers without the need to click though your whole app 👩‍🎨
* See review feedback directly in GitHub 🤓

## 🤷‍♀️ How does it work?

<a href="https://www.youtube.com/watch?v=1khQgylWdoM">![Demo of Bojagi](https://user-images.githubusercontent.com/216917/104968120-48481b00-59e5-11eb-9f12-0081c1a117e5.png)</a>

Upload your components with our CLI and we display them! After you open your PR in GitHub you
can easily review all the changes. The review status is then automatically sent to GitHub so you
see if you got greenlit without needing to leave GitHub! Start with writing stories (Storybook works out of the box 📦).

[Look a the quickstart guide here!](https://bojagi.io/docs/quickstart.html)

## 🔮 How to use the CLI?

Install it into your project with yarn:

```
yarn add -D @bojagi/cli
```

or npm:

```
npm install --save-dev @bojagi/cli
```

After writing your stories you can test if everything works by listing the components:

```
yarn bojagi preview # or: npx bojagi preview
```

After that you can try to deploy to Bojagi:

```
yarn bojagi deploy # or: npx bojagi deploy
```

[Read more on using the CLI here](https://bojagi.io/docs/cli/)

## License

3-Clause BSD License

