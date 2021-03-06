import logging
from flask import jsonify, request
import flask_login

from server import app
from server.util.request import form_fields_required, api_error_handler
from server.auth import user_admin_mediacloud_client, user_mediacloud_client

logger = logging.getLogger(__name__)

NEW_FOCAL_SET_PLACEHOLDER_ID = -1


@app.route('/api/topics/<topics_id>/focus-definitions/update-or-create', methods=['POST'])
@form_fields_required('focalSetDefinitionId', 'focusName', 'focusDescription', 'keywords')
@flask_login.login_required
@api_error_handler
def topic_focus_definition_update_or_create(topics_id):
    user_mc = user_mediacloud_client()
    name = request.form['focusName']
    description = request.form['focusDescription']
    query = request.form['keywords']
    # update if it has an id, create if new
    if 'foci_id' in request.form:
        # you can't change the focal set a focus is in
        foci_id = request.form['foci_id']
        focus = user_mc.topicFocusDefinitionUpdate(topics_id, foci_id, name=name, description=description,
                                                   query=query)
    else:
        # if new focal set, then create that first
        if int(request.form['focalSetDefinitionId']) is NEW_FOCAL_SET_PLACEHOLDER_ID:
            name = request.form['focalSetName']
            description = request.form['focalSetDescription']
            focal_technique = request.form['focalTechnique']
            new_focal_set = user_mc.topicFocalSetDefinitionCreate(topics_id, name, description, focal_technique)
            focal_set_definitions_id = new_focal_set['focal_set_definitions_id']
        else:
            focal_set_definitions_id = request.form['focalSetDefinitionId']
        # create focus, pointing at focal set
        focus = user_mc.topicFocusDefinitionCreate(topics_id, name=name, description=description,
                                                   query=query, focal_set_definitions_id=focal_set_definitions_id)
    return jsonify(focus)



@app.route('/api/topics/<topics_id>/focus-definitions/<foci_definition_id>/delete', methods=['DELETE'])
@flask_login.login_required
@api_error_handler
def topic_focus_definition_delete(topics_id, foci_definition_id):
    user_mc = user_admin_mediacloud_client()
    results = user_mc.topicFocusDefinitionDelete(topics_id, foci_definition_id)
    return jsonify(results)
