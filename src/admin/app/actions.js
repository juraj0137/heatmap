export const FLASH_MESSAGE_ADD = 'flash_message_add';
export const FLASH_MESSAGE_REMOVE = 'flash_message_remove';

/**
 * flashmessages
 */
export function addFlashmessage(flashMessage) {
    return {
        type: FLASH_MESSAGE_ADD,
        flashMessage: flashMessage
    };
}
export function removeFlashmessage(flashMessage) {
    return {
        type: FLASH_MESSAGE_REMOVE,
        flashMessage: flashMessage
    };
}