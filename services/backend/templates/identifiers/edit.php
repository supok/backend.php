<!--{*
Created on: 2011-03-18 13:20:47 198
*}-->
<div class="information">
    <ul class="links">
        <li><a href="identifiers-list.php"><img src="{'table'|icon}" title="List Identifiers"
                                                alt="List Identifiers"/> List Identifiers</a></li>
    </ul>
</div>
<div class="clear"><!--{*  style="clear:both;" *}--></div>
<form id="identifiers-edit-form" name="identifiers-edit-form" method="post" action="identifiers-edit.php">
    <table class="data edit">
        <!-- file or image upload script/patch --><!--{*
	<tr class="{cycle values='A,B'} waring-overwrite">
		<td class="attribute">identifiers File/Picture:</td>
		<td>
			<input type="file" name="identifiersfile" id="identifiersfile" value="" />
			<a href="{$identifiers.identifiersfile}" target="preview">View current</a>
		</td>
	</tr>
*}-->
        <tr class="{cycle values='A,B'}">
            <td class="attribute">Identifier Context:</td>
            <td><input type="text" name="identifiers[identifier_context]"
                       value="{$identifiers.identifier_context|htmlentities}" class="input"
                       id="identifiers-identifier_context"/></td>
        </tr>
        <tr class="{cycle values='A,B'}">
            <td class="attribute">Identifier Code:</td>
            <td><input type="text" name="identifiers[identifier_code]"
                       value="{$identifiers.identifier_code|htmlentities}" class="input"
                       id="identifiers-identifier_code"/></td>
        </tr>
        <!--{*
            <tr class="{cycle values='A,B'}">
                <td class="attribute">Identifier Name:</td>
                <td><input type="text" name="identifiers[identifier_name]" value="{$identifiers.identifier_name|htmlentities}" class="input" id="identifiers-identifier_name" /></td>
            </tr>
        *}-->
        <tr class="{cycle values='A,B'}">
            <td class="attribute">Identifier SQL:</td>
            <td><textarea name="identifiers[identifier_sql]" class="input"
                          id="identifiers-identifier_sql">{$identifiers.identifier_sql|htmlentities}</textarea></td>
        </tr>
        <tr class="{cycle values='A,B'}">
            <td class="attribute">Identifier Comments:</td>
            <td><textarea name="identifiers[identifier_comments]" class="input"
                          id="identifiers-identifier_comments">{$identifiers.identifier_comments|htmlentities}</textarea>
            </td>
        </tr>
        <tr>
            <td class="attribute">&nbsp;</td>
            <td>
                <input type="text" name="email" value="" class="vanish"/> <input type="text" name="is_spam" value=""
                                                                                 class="vanish"/>
                <!--{* 100% sure, only spammers fill these fields, Leave blank. *}-->
                <input type="hidden" name="identifier_id" value="{$identifiers.identifier_id}"/>
                <!-- This is different than system's protection code. This is related to particular ID. -->
                <input type="hidden" name="protection_code" value="{$identifiers.code}"/> <input type="hidden"
                                                                                                 name="edit-action"
                                                                                                 value="Edit Identifiers"/>
                <input type="submit" name="submit-button" class="submit" value="Save Changes"/> Or, <a
                    href="{\common\url::last_page('identifiers-list.php')}">Cancel</a>
            </td>
        </tr>
    </table>
</form>
<!-- Validation -->
<script type="text/javascript" src="js/validator/gen_validatorv31.js"></script>
{js src='validators/identifiers/edit.js' validator=true}
<!-- Rich Editor: Remove if not necessary. Or, use different .js files -->
<script type="text/javascript" src="js/tinymce/tiny_mce.js"></script>
<script type="text/javascript" src="js/tinymce-textareas.js"></script>
<!-- End of identifiers Edit -->