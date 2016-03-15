import run from './gen'

const init = () =>  {
  const head = document.getElementById('head')
  var capture = window.location.search.match(/\?post=(\d+)/)
  var postid = capture ? capture[1] : null
  if (postid) {
    window.location.href = 'https://github.com/livoras/blog/issues/' + postid
  }
  run('Too young, too simple. Sometimes, naive.').history.forEach((text, i) => {
    setTimeout(function () {
      head.innerText = text;
    }, i * 30)
  })
}

init()
