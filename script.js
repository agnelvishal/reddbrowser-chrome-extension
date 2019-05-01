$("#target").click(function () {


    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {

        console.log("tabs");

        var tab = tabs[0];
        window.open('https://www.reddit.com/submit?url=' + tab.url, '_blank');


    });
});


$("#content").html('<div id="loader" width="100%" height="46px" style="text-align:center;text-align:center;"><img width="30px" height="30px" style="margin:auto;" src="loader.gif" /><div>');
th = loadData();

function loadData() {
    threads = [];

    setTimeout(
        function () {
            //do something special


            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {

                console.log(tabs)

                // since only one tab should be active and in the current window at once
                // the return variable should only have one entry
                var activeTab = tabs[0];

                console.log(tabs[0])
                console.log(activeTab)

                console.log('https://www.reddit.com/search.json?q=url:\"' + activeTab.url.split('?')[0].split('#')[0] + '\"')


                $.getJSON('https://www.reddit.com/search.json?q=url:\"' + activeTab.url + '\"', function (read_data) {
                    children = read_data.data.children;

                    console.log(read_data)
                    console.log(children)

                    for (let i = 0; i < children.length; i++) {
                        title = children[i].data.title;
                        author = children[i].data.author;
                        permalink = children[i].data.permalink;
                        subreddit_name_prefixed = children[i].data.subreddit_name_prefixed;
                        score = children[i].data.score;
                        num_comments = children[i].data.num_comments;

                        $("#content").append($(
                            "<a  class='post' href='https://reddit.com" + permalink + "' target='_blank''><p>" + subreddit_name_prefixed + " \u00B7 posted by " + author + "</p><strong>" + title + "</strong><p>" + score + " points \u00B7 " + num_comments + " comments</p> </a>"))

                        // Create object from above data.
                        let current_object = {
                            "title": title,
                            "author": author,
                            "permalink": permalink,
                            "subreddit_name_prefixed": subreddit_name_prefixed,
                            "score": score,
                            "num_comments": num_comments
                        };


                        // Push to threads array.
                        threads.push(current_object);
                    }
                    $("#content").append($(
                        "<article  style='border:none!important;cursor:default!important' class='post'><a><strong style='font-family:Roboto_Regular; cursor:auto!important'>You've reached the end of the list</strong</a><article>"))
                });
            });

            $("#loader").remove();

        }, 750);
    return threads;
}
