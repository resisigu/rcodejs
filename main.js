function initCodeViewer() {
  function saveToCache(code, url, title) {
    let cache = JSON.parse(localStorage.getItem('codeViewerCache') || '[]');
    cache.unshift({url: url, code: code, title: title, timestamp: Date.now()});
    cache = cache.slice(0, 20);
    localStorage.setItem('codeViewerCache', JSON.stringify(cache));
  }

  function displaySourceCode(sourceCode, url, title) {
    var escapedCode = sourceCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    var newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Source Code - ${title}</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/vs2015.min.css">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
          <style>
            body {
              background: #1e1e1e;
              color: #d4d4d4;
              font-family: Consolas, monospace;
              font-size: 14px;
              margin: 0;
              padding: 60px 0 0;
              line-height: 1.5;
              height: 100vh;
              box-sizing: border-box;
            }
            .code-container {
              display: flex;
              overflow: auto;
              height: calc(100% - 60px);
            }
            .line-numbers {
              counter-reset: line;
              padding: 0 16px;
              text-align: right;
              user-select: none;
              flex-shrink: 0;
            }
            .line-numbers span {
              counter-increment: line;
              display: block;
              color: #858585;
              height: 1.5em;
            }
            .line-numbers span::before {
              content: counter(line);
            }
            pre {
              margin: 0;
              padding: 0 0 20px;
            }
            code {
              display: block;
              padding-left: 16px !important;
              border-left: 1px solid #404040;
              min-height: 100%;
            }
            code .hljs-ln-line {
              display: block;
              line-height: 1.5em;
            }
            #header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              background: #333;
              color: #fff;
              padding: 10px;
              text-align: center;
              z-index: 9999;
            }
            #menu-button {
              position: absolute;
              right: 10px;
              top: 5px;
              cursor: pointer;
              font-size: 24px;
            }
            #menu {
              position: fixed;
              top: 50px;
              right: 10px;
              background: #fff;
              border: 1px solid #ccc;
              padding: 10px;
              display: none;
              z-index: 9999;
              max-height: calc(100vh - 70px);
              overflow-y: auto;
              color: #000;
            }
            .delete-btn {
              color: red;
              cursor: pointer;
              margin-left: 10px;
            }
            #clear-all {
              background: #f44336;
              color: white;
              border: none;
              padding: 5px 10px;
              cursor: pointer;
              margin-top: 10px;
            }
            .developer-link {
              display: block;
              margin-top: 10px;
              color: #0066cc;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div id="header">
            <span style="font-size:20px;">resisigu's code viewer JS</span>
            <div id="menu-button" onclick="toggleMenu()">☰</div>
          </div>
          <div id="menu"></div>
          <div class="code-container">
            <div class="line-numbers">
              ${escapedCode.split('\n').map(() => '<span></span>').join('')}
            </div>
            <pre><code class="html">${escapedCode}</code></pre>
          </div>
          <script>
            hljs.highlightAll();

            function toggleMenu() {
              const menu = document.getElementById('menu');
              menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            }

            function createMenu() {
              const menu = document.getElementById('menu');
              const cache = JSON.parse(localStorage.getItem('codeViewerCache') || '[]');
              menu.innerHTML = '<h3>過去の閲覧履歴</h3>' + cache.map((item, index) => 
                \`<div>
                  <a href="#" onclick="loadCode(\${index})">\${item.title || item.url}</a>
                  <span class="delete-btn" onclick="deleteItem(\${index})">×</span>
                </div>\`
              ).join('') + '<button id="clear-all" onclick="clearAll()">全ての履歴を削除</button>' +
              '<a href="https://resisigu.42web.io/" class="developer-link" target="_blank">開発者：resisigu</a>';
            }

            function loadCode(index) {
              const cache = JSON.parse(localStorage.getItem('codeViewerCache') || '[]');
              if (cache[index]) {
                document.body.innerHTML = cache[index].code;
                createMenu();
                hljs.highlightAll();
              }
            }

            function deleteItem(index) {
              let cache = JSON.parse(localStorage.getItem('codeViewerCache') || '[]');
              cache.splice(index, 1);
              localStorage.setItem('codeViewerCache', JSON.stringify(cache));
              createMenu();
            }

            function clearAll() {
              if (confirm('全ての履歴を削除してもよろしいですか？')) {
                localStorage.removeItem('codeViewerCache');
                createMenu();
              }
            }

            createMenu();
          </script>
        </body>
      </html>
    `);
    newWindow.document.close();
    saveToCache(newWindow.document.documentElement.outerHTML, url, title);
  }

  var sourceCode = document.documentElement.outerHTML;
  var url = window.location.href;
  var title = document.title;
  displaySourceCode(sourceCode, url, title);
}
