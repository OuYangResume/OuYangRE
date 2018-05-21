{% if page.comments && theme.gitalk.enable %}
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css">
  <script src="https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js"></script>
   <script type="text/javascript">
      
const gitalk = new Gitalk({
  clientID: '76bfb3ebd7b98d89f89e',
          clientSecret: '1b8613f6f4ec3f1f67446e72e6cecb034ac9765d',
          repo: 'OuYangResume.github.io',
          owner: 'OuYangResume',
          admin: ['OuYangResume'],
          id: location.pathname,
          distractionFreeMode: false
})

gitalk.render('gitalk-container')		
       </script>
{% endif %}