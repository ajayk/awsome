var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');


/* GET users listing. */
router.get('/', function (req, res) {
    try {

        AWS.config.update({
            region: 'us-east-1'
        });

        var ec2 = new AWS.EC2();
        var params = {

        };

        var nodes = []
        ec2.describeInstances(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                // console.log(data);           // successful response
                var reservations = data.Reservations;
                reservations.forEach(function (i) {
                    var instances = i.Instances;
                   // console.log(instances[0].InstanceId);
                    var n = {}
                    n.instanceId = instances[0].InstanceId;
                    n.placement = instances["0"].Placement.AvailabilityZone;
                    n.subnetId = instances[0].SubnetId;
                    n.securityGroups = instances[0].SecurityGroups;
                    n.vpcID = instances[0].VpcId;
                    nodes.push(n)
                       console.log(n);
                });
                res.send(nodes);
                return;
            }
        });


        var elbs  = new AWS.ELB();
        elbs.describeLoadBalancers(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else  {

                console.log(data);

                var loadBalanceDesc = data.LoadBalancerDescriptions;

                var elbNodes = [];

                loadBalanceDesc.forEach(function (i){
                    console.log(i);

                    var e = {};
                    e.name = i.LoadBalancerName;
                    e.dnsName = i.DNSName;
                    e.instances = i.Instances;
                    if(i.Instances.length >0 )
                    {
                    elbNodes.push(e);
                    }
                });
               // res.send(elbNodes);
            }
                  // successful response
        });




    } catch (error) {

    }


});

module.exports = router;
