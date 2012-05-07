var $doc = jQuery(document);
function triggerGameEvent(type, data)
{
    $doc.trigger(type,data);
}