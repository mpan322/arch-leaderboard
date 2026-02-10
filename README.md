# Arch Leaderboard
## Description
Arch leaderboard is a live leaderboard for the St Andrews cache simulation practical for computer architecture CS4202.

## Website 
The website can be found at https://mp322.teaching.cs.st-andrews.ac.uk/.

## Submitting Data
### Basics
To submit data you must do the following:
1. Download the cli tool binary from the releases tab on github.
2. Go to https://mp322.teaching.cs.st-andrews.ac.uk/, signup, and verify your account.
3. Go to https://mp322.teaching.cs.st-andrews.ac.uk/account and download your api key.
4. Place your API key in the root directory of your project.
5. Use the cli tool to upload your data!

### Metadata Schema
The exepected schema for your metadata json (passed to the cli tool) is as follows.
```json
{
    "cache_file": <string: name of the cache file config you used>,
    "trace_file": <string: name of the trace file you used>,
    "millis": <int: the number of millis seconds your run took>,
    "output_json": <string: path to the json of results you recorded, matching the spec schema>,
    "language": <string: the programming language you used>
}
```

### Metadata Schema
The exepected schema for your metadata json (passed to the cli tool) is as follows.
```json
{
    "cache_file": <string: name of the cache file config you used>,
    "trace_file": <string: name of the trace file you used>,
    "millis": <int: the number of millis seconds your run took>,
    "language": <string: the programming language you used>
}
```

### Results Schema
The exepected schema for your result json (passed to the cli tool) is that which is
the same as in the practical specification.
