# FB User Photos

This script obtains all user's photos list from Facebook and sorts it by achieved reactions (likes etc.).

- **See**: `photos`

## ACCESS\_TOKEN : `String`
Facebook API access token

- **Kind**: constant
- **See**: https://developers.facebook.com/tools/explorer/

## TIMEOUT : `Number`
Facebook blocks too frequent API calls

- **Kind**: constant

## API\_URL : `String`
Facebook API URL address with API version

- **Kind**: constant

## photos : `Photo[]`
Obtained photos list will be available here

- **Kind**: variable

## Photo ⇐ `Item`
- **Kind**: class
- **Extends**: `Item`

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| album | `Item` | Photo album |

## Item
- **Kind**: class

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| link | `String` | URL address |
| created_time | `String` | Created date and time (ISO format) |
| reactions | `Number` | Number of reactions (likes etc.) |
