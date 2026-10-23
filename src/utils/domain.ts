// Strip the scheme and "www." so "https://www.git" matches "github.com"
export const normalizeDomainQuery = (input: string) =>
	input
		.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, "")
		.replace(/^www\./, "");

// Local dev hosts and bare IPs: localhost, app.localhost, 192.168.1.10, [::1]
const LOCAL_HOSTNAME = String.raw`(?:localhost|[\w-]+\.localhost|\d{1,3}(?:\.\d{1,3}){3}|\[::1\])`;

const LOCAL_HOSTNAME_PATTERN = new RegExp(`^${LOCAL_HOSTNAME}$`, "i");

// A local host with an optional port and path, e.g. localhost:3000/admin
export const LOCAL_ADDRESS_PATTERN = new RegExp(
	String.raw`^${LOCAL_HOSTNAME}(?::\d+)?(?:\/\S*)?$`,
	"i",
);

export const isLocalHostname = (hostname: string) =>
	LOCAL_HOSTNAME_PATTERN.test(hostname);
