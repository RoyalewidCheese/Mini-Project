window.onscroll = function () {
    if (document.documentElement.scrollTop > 300) {
        document.getElementById("page-header-container").classList.add("header-sticky");
    } else {
        document.getElementById("page-header-container").classList.remove("header-sticky");
    }
};

