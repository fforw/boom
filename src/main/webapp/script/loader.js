(function($)
{

this.Loader = {
load:
    function(names, fn)
    {
        var pos = 0;
        var images = [];
        
        var onload = function()
        {
            if (pos < names.length)
            {
                images[pos] = $("<img src='" + names[pos] + "'>").load(onload);
                pos++;
            }
            else
            {
                fn(images);
            }
        };
        
        onload();
    }
};

})(jQuery);