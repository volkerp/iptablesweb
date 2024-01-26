export const iptables = {
  "tables": [
    {
      "name": "filter",
      "chains": {
        "OUTPUT": {
          "name": "OUTPUT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": [
            {
              "rule": "-j LIBVIRT_OUT",
              "counter": {
                "packets": 715508,
                "bytes": 110314971
              },
              "comment": null
            }
          ]
        },
        "LIBVIRT_OUT": {
          "name": "LIBVIRT_OUT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-o virbr0 -p udp -m udp --dport 53 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o virbr0 -p tcp -m tcp --dport 53 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o virbr0 -p udp -m udp --dport 68 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o virbr0 -p tcp -m tcp --dport 68 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "LIBVIRT_FWO": {
          "name": "LIBVIRT_FWO",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-s 192.168.122.0/24 -i virbr0 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i virbr0 -j REJECT --reject-with icmp-port-unreachable",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "INPUT": {
          "name": "INPUT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": [
            {
              "rule": "-j LIBVIRT_INP",
              "counter": {
                "packets": 977716,
                "bytes": 1212057091
              },
              "comment": null
            }
          ]
        },
        "LIBVIRT_FWX": {
          "name": "LIBVIRT_FWX",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-i virbr0 -o virbr0 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "DOCKER": {
          "name": "DOCKER",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-d 172.26.0.4/32 ! -i br-276962551cad -o br-276962551cad -p tcp -m tcp --dport 8000 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "FORWARD": {
          "name": "FORWARD",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": [
            {
              "rule": "-j DOCKER-USER",
              "counter": {
                "packets": 1542528,
                "bytes": 227492352
              },
              "comment": null
            },
            {
              "rule": "-j DOCKER-ISOLATION-STAGE-1",
              "counter": {
                "packets": 1542528,
                "bytes": 227492352
              },
              "comment": null
            },
            {
              "rule": "-o docker0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o docker0 -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i docker0 ! -o docker0 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i docker0 -o docker0 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-3853238d9289 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-3853238d9289 -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-3853238d9289 ! -o br-3853238d9289 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-3853238d9289 -o br-3853238d9289 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-276962551cad -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 1475864,
                "bytes": 223492512
              },
              "comment": null
            },
            {
              "rule": "-o br-276962551cad -j DOCKER",
              "counter": {
                "packets": 66664,
                "bytes": 3999840
              },
              "comment": null
            },
            {
              "rule": "-i br-276962551cad ! -o br-276962551cad -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-276962551cad -o br-276962551cad -j ACCEPT",
              "counter": {
                "packets": 66664,
                "bytes": 3999840
              },
              "comment": null
            },
            {
              "rule": "-o br-1aae7d5a106d -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-1aae7d5a106d -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-1aae7d5a106d ! -o br-1aae7d5a106d -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-1aae7d5a106d -o br-1aae7d5a106d -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-0e6b69fdd963 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-0e6b69fdd963 -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-0e6b69fdd963 ! -o br-0e6b69fdd963 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-0e6b69fdd963 -o br-0e6b69fdd963 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-f7a3e8ca0cbf -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-f7a3e8ca0cbf -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-f7a3e8ca0cbf ! -o br-f7a3e8ca0cbf -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-f7a3e8ca0cbf -o br-f7a3e8ca0cbf -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-bd87caed08fb -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-bd87caed08fb -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-bd87caed08fb ! -o br-bd87caed08fb -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-bd87caed08fb -o br-bd87caed08fb -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-9df2553f0a02 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-9df2553f0a02 -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-9df2553f0a02 ! -o br-9df2553f0a02 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-9df2553f0a02 -o br-9df2553f0a02 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-j LIBVIRT_FWX",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-j LIBVIRT_FWI",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-j LIBVIRT_FWO",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "LIBVIRT_INP": {
          "name": "LIBVIRT_INP",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-i virbr0 -p udp -m udp --dport 53 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i virbr0 -p tcp -m tcp --dport 53 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i virbr0 -p udp -m udp --dport 67 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i virbr0 -p tcp -m tcp --dport 67 -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "LIBVIRT_FWI": {
          "name": "LIBVIRT_FWI",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-d 192.168.122.0/24 -o virbr0 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o virbr0 -j REJECT --reject-with icmp-port-unreachable",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "DOCKER-ISOLATION-STAGE-1": {
          "name": "DOCKER-ISOLATION-STAGE-1",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-i docker0 ! -o docker0 -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-3853238d9289 ! -o br-3853238d9289 -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-276962551cad ! -o br-276962551cad -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-1aae7d5a106d ! -o br-1aae7d5a106d -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-0e6b69fdd963 ! -o br-0e6b69fdd963 -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-f7a3e8ca0cbf ! -o br-f7a3e8ca0cbf -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-bd87caed08fb ! -o br-bd87caed08fb -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-9df2553f0a02 ! -o br-9df2553f0a02 -j DOCKER-ISOLATION-STAGE-2",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-j RETURN",
              "counter": {
                "packets": 1542528,
                "bytes": 227492352
              },
              "comment": null
            }
          ]
        },
        "DOCKER-ISOLATION-STAGE-2": {
          "name": "DOCKER-ISOLATION-STAGE-2",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-o docker0 -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-3853238d9289 -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-276962551cad -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-1aae7d5a106d -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-0e6b69fdd963 -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-f7a3e8ca0cbf -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-bd87caed08fb -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-o br-9df2553f0a02 -j DROP",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "DOCKER-USER": {
          "name": "DOCKER-USER",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-j RETURN",
              "counter": {
                "packets": 1542528,
                "bytes": 227492352
              },
              "comment": null
            }
          ]
        }
      }
    },
    {
      "name": "nat",
      "chains": {
        "INPUT": {
          "name": "INPUT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": []
        },
        "OUTPUT": {
          "name": "OUTPUT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": [
            {
              "rule": "! -d 127.0.0.0/8 -m addrtype --dst-type LOCAL -j DOCKER",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "POSTROUTING": {
          "name": "POSTROUTING",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": [
            {
              "rule": "-s 172.17.0.0/16 ! -o docker0 -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 172.19.0.0/16 ! -o br-3853238d9289 -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 172.26.0.0/16 ! -o br-276962551cad -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 172.22.0.0/16 ! -o br-1aae7d5a106d -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 172.20.0.0/16 ! -o br-0e6b69fdd963 -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 172.18.0.0/16 ! -o br-f7a3e8ca0cbf -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 172.23.0.0/16 ! -o br-bd87caed08fb -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 172.21.0.0/16 ! -o br-9df2553f0a02 -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-j LIBVIRT_PRT",
              "counter": {
                "packets": 88942,
                "bytes": 5827566
              },
              "comment": null
            },
            {
              "rule": "-s 172.26.0.4/32 -d 172.26.0.4/32 -p tcp -m tcp --dport 8000 -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "LIBVIRT_PRT": {
          "name": "LIBVIRT_PRT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-s 192.168.122.0/24 -d 224.0.0.0/24 -j RETURN",
              "counter": {
                "packets": 47,
                "bytes": 4227
              },
              "comment": null
            },
            {
              "rule": "-s 192.168.122.0/24 -d 255.255.255.255/32 -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 192.168.122.0/24 ! -d 192.168.122.0/24 -p tcp -j MASQUERADE --to-ports 1024-65535",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 192.168.122.0/24 ! -d 192.168.122.0/24 -p udp -j MASQUERADE --to-ports 1024-65535",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-s 192.168.122.0/24 ! -d 192.168.122.0/24 -j MASQUERADE",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "DOCKER": {
          "name": "DOCKER",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-i docker0 -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-3853238d9289 -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-276962551cad -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-1aae7d5a106d -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-0e6b69fdd963 -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-f7a3e8ca0cbf -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-bd87caed08fb -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "-i br-9df2553f0a02 -j RETURN",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            },
            {
              "rule": "! -i br-276962551cad -p tcp -m tcp --dport 80 -j DNAT --to-destination 172.26.0.4:8000",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "PREROUTING": {
          "name": "PREROUTING",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": [
            {
              "rule": "-m addrtype --dst-type LOCAL -j DOCKER",
              "counter": {
                "packets": 7,
                "bytes": 493
              },
              "comment": null
            }
          ]
        }
      }
    },
    {
      "name": "mangle",
      "chains": {
        "INPUT": {
          "name": "INPUT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": []
        },
        "FORWARD": {
          "name": "FORWARD",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": []
        },
        "LIBVIRT_PRT": {
          "name": "LIBVIRT_PRT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": false,
          "policy": null,
          "rules": [
            {
              "rule": "-o virbr0 -p udp -m udp --dport 68 -j CHECKSUM --checksum-fill",
              "counter": {
                "packets": 0,
                "bytes": 0
              },
              "comment": null
            }
          ]
        },
        "OUTPUT": {
          "name": "OUTPUT",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": []
        },
        "PREROUTING": {
          "name": "PREROUTING",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": []
        },
        "POSTROUTING": {
          "name": "POSTROUTING",
          "counter": {
            "packets": 0,
            "bytes": 0
          },
          "builtin": true,
          "policy": "Accept",
          "rules": [
            {
              "rule": "-j LIBVIRT_PRT",
              "counter": {
                "packets": 2258786,
                "bytes": 337892823
              },
              "comment": null
            }
          ]
        }
      }
    }
  ]
}

