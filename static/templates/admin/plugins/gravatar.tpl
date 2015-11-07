<form role="form" class="gravatar-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Gravatar</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<label for="default" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="default" name="default" />
					<span class="mdl-switch__label">Use Gravatar as default user picture</span>
				</label>
			</div>
			<div class="checkbox">
				<label for="force" class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
					<input type="checkbox" class="mdl-switch__input" id="force" name="force" />
					<span class="mdl-switch__label">Force all users to use Gravatar</span>
				</label>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Default Image</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<select name="iconDefault" class="form-control">
					<option value="">Return the generic Gravatar image</option>
					<option value="404">Return a broken image if no image is set</option>
					<option value="mm">Mystery Man: A simple, cartoon-style silhouetted outline of a person</option>
					<option value="identicon">Identicon: A geometric pattern based on an email hash</option>
					<option value="monsterid">Monster ID: A generated 'monster' with different colors, faces, etc</option>
					<option value="wavatar">Wavatar: Generated faces with differing features and backgrounds</option>
					<option value="retro">Retro: Awesome generated, 8-bit arcade-style pixelated faces</option>
					<option value="blank">Blank: A transparent PNG image</option>
				</select>
			</div>
			<div class="form-group">
				<label for="customDefault">Custom Default Image</label>
				<input type="text" class="form-control" id="customDefault" name="customDefault" />
				<p class="help-block">
					Enter an URL here, and it will be used as the default
					(overrides the previous option)
				</p>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>