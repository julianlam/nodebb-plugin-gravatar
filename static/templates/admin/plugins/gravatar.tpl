<form role="form" class="gravatar-settings">
	<div class="row">
		<div class="col-12 col-sm-2 settings-header">Gravatar</div>
		<div class="col-12 col-sm-10">
			<div class="form-check form-switch mb-3">
				<input type="checkbox" class="form-check-input" id="default" name="default">
				<label for="default" class="form-check-label">Use Gravatar as default user picture</label>
			</div>
			<div class="form-check form-switch mb-3">
				<input type="checkbox" class="form-check-input" id="force" name="force">
				<label for="force" class="form-check-label">Force all users to use Gravatar</label>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-12 col-sm-2 settings-header">Default Image</div>
		<div class="col-12 col-sm-10">
			<div class="mb-3">
				<select name="iconDefault" class="form-select">
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
			<div class="mb-3">
				<label for="customDefault">Custom Default Image</label>
				<input type="text" class="form-control" id="customDefault" name="customDefault" />
				<p class="form-text">
					Enter an URL here, and it will be used as the default (overrides the previous option)
				</p>
			</div>
		</div>
	</div>
</form>

<!-- IMPORT admin/partials/save_button.tpl -->
