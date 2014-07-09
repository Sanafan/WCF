<script data-relocate="true">
var __REDACTOR_ICON_PATH = '{@$__wcf->getPath()}icon/';
var __REDACTOR_BUTTONS = [ {implode from=$__wcf->getBBCodeHandler()->getButtonBBCodes() item=__bbcode}{ icon: '{$__bbcode->wysiwygIcon}', label: '{$__bbcode->buttonLabel|language}', name: '{$__bbcode->bbcodeTag}' }{/implode} ];
var __REDACTOR_SMILIES = { {implode from=$__wcf->getSmileyCache()->getCategorySmilies() item=smiley}'{@$smiley->smileyCode|encodeJS}': '{@$smiley->getURL()|encodeJS}'{/implode} };
var __REDACTOR_SOURCE_BBCODES = [ {implode from=$__wcf->getBBCodeHandler()->getSourceBBCodes() item=__bbcode}'{@$__bbcode->bbcodeTag}'{/implode} ];
</script>
<script data-relocate="true">
$(function() {
	var $editorName = '{if $wysiwygSelector|isset}{$wysiwygSelector|encodeJS}{else}text{/if}';
	var $callbackIdentifier = 'Redactor_' + $editorName;
	
	WCF.System.Dependency.Manager.setup($callbackIdentifier, function() {
		var $textarea = $('#' + $editorName);
		var $buttons = [ ];
		
		{include file='wysiwygToolbar'}
		
		var $autosave = $textarea.data('autosave');
		var $config = {
			buttons: $buttons,
			convertImageLinks: false,
			convertLinks: false,
			convertVideoLinks: false,
			direction: '{lang}wcf.global.pageDirection{/lang}',
			lang: '{@$__wcf->getLanguage()->getFixedLanguageCode()}',
			minHeight: 200,
			imageResizable: false,
			plugins: [ 'wutil',  'wmonkeypatch', 'wbutton', 'wbbcode',  'wfontcolor', 'wfontfamily', 'wfontsize' ],
			wautosave: {
				active: ($autosave) ? true : false,
				key: ($autosave) ? '{@$__wcf->getAutosavePrefix()}_' + $autosave : '',
				saveOnInit: {if !$errorField|empty}true{else}false{/if}
			},
			wOriginalValue: $textarea.val()
		};
		
		{event name='javascriptInit'}
		
		$textarea.redactor($config);
	});
	
	head.load([
		'{@$__wcf->getPath()}js/3rdParty/redactor/redactor{if !ENABLE_DEBUG_MODE}.min{/if}.js?v={@$__wcfVersion}',
		{if $__wcf->getLanguage()->getFixedLanguageCode() != 'en'}'{@$__wcf->getPath()}js/3rdParty/redactor/languages/{@$__wcf->getLanguage()->getFixedLanguageCode()}.js?v={@$__wcfVersion}',{/if}
		{if !ENABLE_DEBUG_MODE}
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wcombined.min.js?v={@$__wcfVersion}',
		{else}
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wbbcode.js?v={@$__wcfVersion}',
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wbutton.js?v={@$__wcfVersion}',
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wfontcolor.js?v={@$__wcfVersion}',
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wfontfamily.js?v={@$__wcfVersion}',
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wfontsize.js?v={@$__wcfVersion}',
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wmonkeypatch.js?v={@$__wcfVersion}',
			'{@$__wcf->getPath()}js/3rdParty/redactor/plugins/wutil.js?v={@$__wcfVersion}',
		{/if}
		{event name='javascriptFiles'}
	], function() {
		WCF.System.Dependency.Manager.invoke($callbackIdentifier);
	});
});
</script>