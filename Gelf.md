GELF via UDP
Chunking
UDP datagrams are limited to a size of 65536 bytes. Some Graylog components are limited to processing up to 8192 bytes. Substantial compressed information fits within the size limit, but you may have more information to send; this is why Graylog supports chunked GELF.

You can define chunks of messages by prepending a byte header to a GELF message, including a message ID and sequence number to reassemble the message later. Most GELF libraries support chunking transparently and will detect if a message is too big to be sent in one datagram.

TCP would solve this problem on a transport layer, but it has other problems that are even harder to tackle: slow connections, timeouts, and other network problems.

Messages can be lost with UDP, and TCP can dismantle the whole application when not designed carefully.

Of course, especially in high-volume environments, TCP is sensible. Many GELF libraries support both TCP and UDP as transport, and some also support https.

Prepend the following structure to your GELF message to make it chunked:

Chunked GELF magic bytes - 2 bytes: 0x1e 0x0f
Message ID - 8 bytes: Must be the same for every chunk of this message. Identifies the whole message and is used to reassemble the chunks later. Generate from millisecond timestamp + hostname, for example.
Sequence number - 1 byte: The sequence number of this chunk starts at 0 and is always less than the sequence count.
Sequence count - 1 byte: Total number of chunks this message has.
All chunks MUST arrive within 5 seconds or the server will discard all chunks that have arrived or are in the process of arriving. A message MUST NOT consist of more than 128 chunks.

Warning: Please note that the UDP-Inputs of Graylog use the SO_REUSEPORT socket option, which was introduced in Linux kernel version 3.9. So be aware that UDP inputs will NOT work on Linux kernel versions before 3.9.
Compression
When using UDP as transport layer, GELF messages can be sent uncompressed or compressed with either GZIP or ZLIB.
Graylog nodes automatically detect the compression type in the GELF magic byte header.

Decide if you want to trade a bit more CPU load for saving network bandwidth. GZIP is the protocol default.

GELF via TCP
At the current time, GELF TCP only supports uncompressed and non-chunked payloads. Each message needs to be delimited with a null byte (\0) when sent in the same TCP connection.

Warning: GELF TCP does not support compression due to the use of the null byte (\0) as frame delimiter.
GELF Payload Specification
Version 1.1 (11/2013)
A GELF message is a JSON string with the following fields:

version string (UTF-8)

GELF spec version – “1.1”; MUST be set by the client library.
host string (UTF-8)

the name of the host, source or application that sent this message; MUST be set by the client library.
short_message string (UTF-8)

a short, descriptive message; MUST be set by the client library.
full_message string (UTF-8)

a long message that can contain a backtrace; optional.
timestamp number

seconds since UNIX epoch with optional decimal places for milliseconds; SHOULD be set by the client library. If absent, the timestamp will be set to the current time (now).
level number

the level equal to the standard syslog levels; optional. Default is 1 (ALERT).
facility string (UTF-8)

optional, deprecated. Send as additional field instead.
linenumber**

the line in a file that caused the error (decimal); optional, deprecated. Send as an additional field instead.
filestring (UTF-8) an

the file (with path, if you want) that caused the error (string); optional, deprecated. Send as an additional field instead.
_[additional field] string (UTF-8) or number

every field you send and prefix with an underscore ( _) will be treated as an additional field. Allowed characters in field names are any word character (letter, number, underscore), dashes and dots. The , verifying regular expression is: ^[\\w\\.\\-]*$. Libraries SHOULD not allow to send id as additional field ( _id). Graylog server nodes omit this field automatically.
Example Payload
This is an example GELF message payload. Any Graylog-server node accepts and stores this as a message when GZIP/ZLIB is compressed or even when sent uncompressed over a plain socket without new lines.

Hint: New lines must be denoted with the \n escape sequence to ensure the payload is valid JSON as per RFC 7159.

```json
{
"version": "1.1",
"host": "example.org",
"short_message": "A short message that helps you identify what is going on",
"full_message": "Backtrace here\n\nmore stuff",
"timestamp": 1385053862.3072,
"level": 1,
"_user_id": 9001,
"_some_info": "foo",
"_some_env_var": "bar"
}



```

```bash
curl -X POST -H 'Content-Type: application/json' -d '{ "version": "1.1", "host": "example.org", "short_message": "A short message", "level": 5, "_some_info": "foo" }' 'http://graylog.example.com:12201/gelf'

```
