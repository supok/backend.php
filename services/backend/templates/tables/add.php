<!-- Created on: 2010-06-11 02:19:25 152 -->
<div class="information">
    <ul>
        <li><a href="tables-list.php"><img src="{'table'|icon}"/> List tables</a></li>
    </ul>
</div>
<form autocomplete="off" id="tables-add-form" name="tables-add-form" method="post" action="tables-add.php">
    <table class="data">
        <!-- "Auto Generated" list of columns. Please adjust according to your needs. -->
        <!-- Remove [ table_id ] in the list. -->
        <tr>
            <td class="attribute">Table Name:</td>
            <td><input type="text" class="input" name="tables[table_name]" value="{$tables.table_name|htmlentities}"/>
            </td>
        </tr>
        <tr>
            <td class="attribute">Table Comments:</td>
            <td><input type="text" class="input" name="tables[table_comments]"
                       value="{$tables.table_comments|htmlentities}"/></td>
        </tr>
        <tr>
            <td class="attribute">Export Structure:</td>
            <td><input type="text" class="input" name="tables[export_structure]"
                       value="{$tables.export_structure|htmlentities}"/></td>
        </tr>
        <tr>
            <td class="attribute">Export Data:</td>
            <td><input type="text" class="input" name="tables[export_data]" value="{$tables.export_data|htmlentities}"/>
            </td>
        </tr>
        <tr>
            <td class="attribute">Export Query:</td>
            <td><textarea name="tables[export_query]" class="input">{$tables.export_query|htmlentities}</textarea></td>
        </tr>
        <tr>
            <td class="attribute">&nbsp;</td>
            <td>
                <input type="hidden" name="protection_code" value="{$protection_code}"/> <input type="hidden"
                                                                                                name="add-action"
                                                                                                value="Add tables"/>
                <input type="submit" name="submit-button" class="submit" value="Add"/> Or, <a
                    href="tables-list.php">Cancel</a></td>
        </tr>
    </table>
</form>
{* Add validation *}
<script type="text/javascript" src="js/validator/gen_validatorv31.js"></script>
{js src='validators/tables/add.js' validator=true}
<!-- Rich Editor: Remove if not necessary. Or, use different .js files -->
<script type="text/javascript" src="js/tinymce/tiny_mce.js"></script>
<script type="text/javascript" src="js/tinymce-textareas.js"></script>
<!-- End of tables Add -->