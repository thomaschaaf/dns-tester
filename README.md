#  Tool to test how many dns loopups are slower than 100 ms

You can specify the `DNS_NAME` and `DNS_NAME_TIMEOUT` environment variables.

Start with:

    kubectl create -f kubernetes/deployment.yml

Get logs with:

    kubectl log dns-tester

Clean up with:

    kubectl delete pod dns-tester
