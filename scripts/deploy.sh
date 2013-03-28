#!/bin/bash
s3cmd -P --guess-mime-type sync app/. s3://outlinee.com
