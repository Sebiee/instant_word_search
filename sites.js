const sites = [
  {
    url: "https://hallo.ro/dictionar-englez-roman/_WORD_",
    size: "0,0",
    pos: "0,0",
    scroll_to: "div.results",
    result_container: "div.content div.results, div.content div.box b"
  },
  {
    url: "https://www.reverso.net/text-translation#sl=eng&tl=rum&text=_WORD_",
    size: "0,0",
    pos: "1045,0",
    scroll_to: "div.translation-languages",
    result_container: "div.context-box"
  },
  {
    url: "https://www.thefreedictionary.com/_WORD_",
    size: "0,0",
    pos: "0,560",
    scroll_to: "div#content",
    result_container: "div#MainTxt"
  },
  {
    url: "https://johnsonsdictionaryonline.com/views/search.php",
    size: "0,0",
    pos: "1045,560",
    input_path: "input[class=search-text]",
    select_path: "#folio_year",
    select_value: "both",
    button: "button[id=btn-search]",
    scroll_to: "#search-row",
    result_container: "#number_results1"
  },
]

module.exports = sites;