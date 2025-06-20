import type { PlasmoMessaging } from "@plasmohq/messaging";
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log('🪵 | History handler | Request:', req.body);

    const body = req.body as {
        search?: string
        maxResults?: number
    }

    const oneWeekMillis =  7 * 24 * 60 * 60 * 1000;
    const oneWeekAgo = Date.now() - oneWeekMillis;

    const history = await chrome.history.search({
        text: body.search || "",
        startTime: oneWeekAgo,
        maxResults: body.maxResults || 100,
    })

    console.log('🪵 | History handler | Found items:', history.length);
    console.log('🪵 | History handler | First item:', history[0]);
 
    res.send({
        history
    })
}
 
export default handler