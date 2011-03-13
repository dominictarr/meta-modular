
OKAY

~~~

whats next?

tests & server basicailly running.

done.

~~~

request fresh platforms and tests

generate trials. 

done.

~~~

request init trials,

start to run a trial: change status to init -> started

run test, 

save results, change status started -> complete

DONE.

~~~

fix test runner problem, signal to child runner tell it time is up.

let it exit, if it still doesn't in 5 sec, kill it.

then we'll have error reports even in timeouts.

done.

~~~

write simpler test for app (which doesn't require running ALL the tests)

~~~

save stdout & stderr

~~~

commandline like search for files with wildcards.

~~~

http push to set tests to run. and to install package.

~~~

then get it running on the cloud server?

run as many npm tests as possible.

detect package and aggregate by package & version.

~~~


ways to request pull of tests, 
specify test adapters for a module,

update trials

test runner that listens on trials to test, and runs tests as necessary...

API to specify what files in npm package are tests & what adapter to use.

authentication before I can let other people use it.

workers that get notified when new tests are added, or new platforms

/*

  heres the plan for the workers:
  
  workers listen on changes on platforms & tests for new items.
  
    (docs with a rev hash like /1-[hex]/)
  
  they save log what seq number they are up to by saving it in a document.
  
    (another database 'meta') save settings in there.

    hmm. my cradle-model is approching an ORM, except it's not an orm because 
    it's not relational. it's a odm object-document-mapper.

  make listeners which respond to new, updates, delete.
  
  when a change comes in, check if it's new, updated, or deleted. retrive the doc
  and pass it to the callback.
  
  will need to make some changes to cradle in order to be able to stop listening.

*/