# URI Structure

## View URIs

View URIs are URIs that are viewed by a client that expects a content-type `text/html` response. All of these should respond with a rendered template or other HTML code.

## API URIs

API URIs are URIs that will respond with a content-type of `application/json` (however some still respond with `text/html` under certain conditions)

## Basic API

URIs that deal with authorization or data retrieval are part of the Basic API. They have a similar structure to Object URIs.

### Object Creation

URIs that are linked to the [creation middleware](middleware/creation.md) are object creation URIs.

List of object creation URIs:

Object | URI
-------|----
User   | `/user/new`
Post   | `/post/new`
Workplace | `/worplace/new`

### Object Modification

URIs that are linked to the modification middleware are object modification URIs.

List of object creation URIs:

Object | URI
-------|----
User   | `/user/{id}/edit`
Post   | `/post/{id}/edit`
Workplace | `/worplace/{id}/edit`
