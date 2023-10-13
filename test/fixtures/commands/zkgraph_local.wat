(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_=>_none (func (param i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_=>_i64 (func (param i32) (result i64)))
 (type $none_=>_i32 (func (result i32)))
 (import "env" "require" (func $~lib/@hyperoracle/zkgraph-lib/common/zkwasm/require (param i32)))
 (import "env" "wasm_input" (func $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/wasm_input (param i32) (result i64)))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 70560))
 (memory $0 2)
 (data (i32.const 70012) ",")
 (data (i32.const 70024) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data (i32.const 70060) ",")
 (data (i32.const 70072) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 70108) "<")
 (data (i32.const 70120) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data (i32.const 70172) "<")
 (data (i32.const 70184) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
 (data (i32.const 70236) "<")
 (data (i32.const 70248) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 70300) "<")
 (data (i32.const 70312) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data (i32.const 70364) "|")
 (data (i32.const 70376) "\02\00\00\00^\00\00\00E\00l\00e\00m\00e\00n\00t\00 \00t\00y\00p\00e\00 \00m\00u\00s\00t\00 \00b\00e\00 \00n\00u\00l\00l\00a\00b\00l\00e\00 \00i\00f\00 \00a\00r\00r\00a\00y\00 \00i\00s\00 \00h\00o\00l\00e\00y")
 (data (i32.const 70492) "<")
 (data (i32.const 70504) "\02\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 70560) "\0e\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00A\00\00\00\01\01\00\00\00\00\00\00A\00\00\00A\00\00\00\02A\00\00 \00\00\00A\00\00\00A\00\00\00\01\02")
 (export "asmain" (func $node_modules/@hyperoracle/zkgraph-lib/common/entries/asmain))
 (export "zkmain" (func $node_modules/@hyperoracle/zkgraph-lib/common/entries/zkmain))
 (export "__new" (func $~lib/rt/stub/__new))
 (export "__pin" (func $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromU8Array))
 (export "__unpin" (func $~lib/rt/stub/__unpin))
 (export "__collect" (func $~lib/rt/stub/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/stub/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   unreachable
  end
  local.get $0
  i32.const 16
  i32.add
  local.tee $4
  i32.const 1073741820
  i32.gt_u
  if
   unreachable
  end
  global.get $~lib/rt/stub/offset
  local.tee $3
  i32.const 4
  i32.add
  local.tee $2
  local.get $4
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.tee $4
  i32.add
  local.tee $5
  memory.size $0
  local.tee $6
  i32.const 16
  i32.shl
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $7
  i32.gt_u
  if
   local.get $6
   local.get $5
   local.get $7
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $7
   local.get $6
   local.get $7
   i32.gt_s
   select
   memory.grow $0
   i32.const 0
   i32.lt_s
   if
    local.get $7
    memory.grow $0
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $5
  global.set $~lib/rt/stub/offset
  local.get $3
  local.get $4
  i32.store $0
  local.get $2
  i32.const 4
  i32.sub
  local.tee $3
  i32.const 0
  i32.store $0 offset=4
  local.get $3
  i32.const 0
  i32.store $0 offset=8
  local.get $3
  local.get $1
  i32.store $0 offset=12
  local.get $3
  local.get $0
  i32.store $0 offset=16
  local.get $2
  i32.const 16
  i32.add
 )
 (func $~lib/memory/memory.fill (param $0 i32) (param $1 i32)
  (local $2 i32)
  block $~lib/util/memory/memset|inlined.0
   local.get $1
   i32.eqz
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store8 $0
   local.get $0
   local.get $1
   i32.add
   local.tee $2
   i32.const 1
   i32.sub
   i32.const 0
   i32.store8 $0
   local.get $1
   i32.const 2
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store8 $0 offset=1
   local.get $0
   i32.const 0
   i32.store8 $0 offset=2
   local.get $2
   i32.const 2
   i32.sub
   i32.const 0
   i32.store8 $0
   local.get $2
   i32.const 3
   i32.sub
   i32.const 0
   i32.store8 $0
   local.get $1
   i32.const 6
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store8 $0 offset=3
   local.get $2
   i32.const 4
   i32.sub
   i32.const 0
   i32.store8 $0
   local.get $1
   i32.const 8
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   i32.const 0
   local.get $0
   i32.sub
   i32.const 3
   i32.and
   local.tee $2
   local.get $0
   i32.add
   local.tee $0
   i32.const 0
   i32.store $0
   local.get $1
   local.get $2
   i32.sub
   i32.const -4
   i32.and
   local.tee $1
   local.get $0
   i32.add
   local.tee $2
   i32.const 4
   i32.sub
   i32.const 0
   i32.store $0
   local.get $1
   i32.const 8
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store $0 offset=4
   local.get $0
   i32.const 0
   i32.store $0 offset=8
   local.get $2
   i32.const 12
   i32.sub
   i32.const 0
   i32.store $0
   local.get $2
   i32.const 8
   i32.sub
   i32.const 0
   i32.store $0
   local.get $1
   i32.const 24
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store $0 offset=12
   local.get $0
   i32.const 0
   i32.store $0 offset=16
   local.get $0
   i32.const 0
   i32.store $0 offset=20
   local.get $0
   i32.const 0
   i32.store $0 offset=24
   local.get $2
   i32.const 28
   i32.sub
   i32.const 0
   i32.store $0
   local.get $2
   i32.const 24
   i32.sub
   i32.const 0
   i32.store $0
   local.get $2
   i32.const 20
   i32.sub
   i32.const 0
   i32.store $0
   local.get $2
   i32.const 16
   i32.sub
   i32.const 0
   i32.store $0
   local.get $0
   i32.const 4
   i32.and
   i32.const 24
   i32.add
   local.tee $2
   local.get $0
   i32.add
   local.set $0
   local.get $1
   local.get $2
   i32.sub
   local.set $1
   loop $while-continue|0
    local.get $1
    i32.const 32
    i32.ge_u
    if
     local.get $0
     i64.const 0
     i64.store $0
     local.get $0
     i64.const 0
     i64.store $0 offset=8
     local.get $0
     i64.const 0
     i64.store $0 offset=16
     local.get $0
     i64.const 0
     i64.store $0 offset=24
     local.get $1
     i32.const 32
     i32.sub
     local.set $1
     local.get $0
     i32.const 32
     i32.add
     local.set $0
     br $while-continue|0
    end
   end
  end
 )
 (func $~lib/typedarray/Uint8Array#constructor (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 4
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 3
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  i32.store $0
  local.get $0
  i32.const 0
  i32.store $0 offset=4
  local.get $0
  i32.const 0
  i32.store $0 offset=8
  local.get $1
  i32.const 1073741820
  i32.gt_u
  if
   unreachable
  end
  local.get $1
  i32.const 1
  call $~lib/rt/stub/__new
  local.tee $2
  local.get $1
  call $~lib/memory/memory.fill
  local.get $0
  local.get $2
  i32.store $0
  local.get $0
  local.get $2
  i32.store $0 offset=4
  local.get $0
  local.get $1
  i32.store $0 offset=8
  local.get $0
 )
 (func $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromU8Array (param $0 i32) (result i32)
  local.get $0
 )
 (func $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromRawarrPtr (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  i32.const 0
  i32.const 0
  call $~lib/typedarray/Uint8Array#constructor
  local.tee $2
  local.get $0
  i32.store $0
  local.get $2
  i32.const 4
  i32.add
  local.get $0
  i32.store $0
  local.get $2
  i32.const 8
  i32.add
  local.get $1
  i32.store $0
  local.get $2
 )
 (func $~lib/util/memory/memcpy (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  loop $while-continue|0
   local.get $1
   i32.const 3
   i32.and
   i32.const 0
   local.get $2
   select
   if
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    local.tee $4
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    local.get $4
    i32.load8_u $0
    i32.store8 $0
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    br $while-continue|0
   end
  end
  local.get $0
  i32.const 3
  i32.and
  i32.eqz
  if
   loop $while-continue|1
    local.get $2
    i32.const 16
    i32.ge_u
    if
     local.get $0
     local.get $1
     i32.load $0
     i32.store $0
     local.get $0
     i32.const 4
     i32.add
     local.get $1
     i32.const 4
     i32.add
     i32.load $0
     i32.store $0
     local.get $0
     i32.const 8
     i32.add
     local.get $1
     i32.const 8
     i32.add
     i32.load $0
     i32.store $0
     local.get $0
     i32.const 12
     i32.add
     local.get $1
     i32.const 12
     i32.add
     i32.load $0
     i32.store $0
     local.get $1
     i32.const 16
     i32.add
     local.set $1
     local.get $0
     i32.const 16
     i32.add
     local.set $0
     local.get $2
     i32.const 16
     i32.sub
     local.set $2
     br $while-continue|1
    end
   end
   local.get $2
   i32.const 8
   i32.and
   if
    local.get $0
    local.get $1
    i32.load $0
    i32.store $0
    local.get $0
    i32.const 4
    i32.add
    local.get $1
    i32.const 4
    i32.add
    i32.load $0
    i32.store $0
    local.get $1
    i32.const 8
    i32.add
    local.set $1
    local.get $0
    i32.const 8
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 4
   i32.and
   if
    local.get $0
    local.get $1
    i32.load $0
    i32.store $0
    local.get $1
    i32.const 4
    i32.add
    local.set $1
    local.get $0
    i32.const 4
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 2
   i32.and
   if
    local.get $0
    local.get $1
    i32.load16_u $0
    i32.store16 $0
    local.get $1
    i32.const 2
    i32.add
    local.set $1
    local.get $0
    i32.const 2
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 1
   i32.and
   if
    local.get $0
    local.get $1
    i32.load8_u $0
    i32.store8 $0
   end
   return
  end
  local.get $2
  i32.const 32
  i32.ge_u
  if
   block $break|2
    block $case2|2
     block $case1|2
      block $case0|2
       local.get $0
       i32.const 3
       i32.and
       i32.const 1
       i32.sub
       br_table $case0|2 $case1|2 $case2|2 $break|2
      end
      local.get $1
      i32.load $0
      local.set $5
      local.get $0
      local.get $1
      i32.load8_u $0
      i32.store8 $0
      local.get $0
      i32.const 1
      i32.add
      local.tee $0
      i32.const 1
      i32.add
      local.set $3
      local.get $1
      i32.const 1
      i32.add
      local.tee $1
      i32.const 1
      i32.add
      local.set $4
      local.get $0
      local.get $1
      i32.load8_u $0
      i32.store8 $0
      local.get $3
      i32.const 1
      i32.add
      local.set $0
      local.get $4
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      local.get $4
      i32.load8_u $0
      i32.store8 $0
      local.get $2
      i32.const 3
      i32.sub
      local.set $2
      loop $while-continue|3
       local.get $2
       i32.const 17
       i32.ge_u
       if
        local.get $0
        local.get $1
        i32.const 1
        i32.add
        i32.load $0
        local.tee $3
        i32.const 8
        i32.shl
        local.get $5
        i32.const 24
        i32.shr_u
        i32.or
        i32.store $0
        local.get $0
        i32.const 4
        i32.add
        local.get $1
        i32.const 5
        i32.add
        i32.load $0
        local.tee $4
        i32.const 8
        i32.shl
        local.get $3
        i32.const 24
        i32.shr_u
        i32.or
        i32.store $0
        local.get $0
        i32.const 8
        i32.add
        local.get $1
        i32.const 9
        i32.add
        i32.load $0
        local.tee $3
        i32.const 8
        i32.shl
        local.get $4
        i32.const 24
        i32.shr_u
        i32.or
        i32.store $0
        local.get $0
        i32.const 12
        i32.add
        local.get $1
        i32.const 13
        i32.add
        i32.load $0
        local.tee $5
        i32.const 8
        i32.shl
        local.get $3
        i32.const 24
        i32.shr_u
        i32.or
        i32.store $0
        local.get $1
        i32.const 16
        i32.add
        local.set $1
        local.get $0
        i32.const 16
        i32.add
        local.set $0
        local.get $2
        i32.const 16
        i32.sub
        local.set $2
        br $while-continue|3
       end
      end
      br $break|2
     end
     local.get $1
     i32.load $0
     local.set $5
     local.get $0
     local.get $1
     i32.load8_u $0
     i32.store8 $0
     local.get $0
     i32.const 1
     i32.add
     local.tee $3
     i32.const 1
     i32.add
     local.set $0
     local.get $1
     i32.const 1
     i32.add
     local.tee $4
     i32.const 1
     i32.add
     local.set $1
     local.get $3
     local.get $4
     i32.load8_u $0
     i32.store8 $0
     local.get $2
     i32.const 2
     i32.sub
     local.set $2
     loop $while-continue|4
      local.get $2
      i32.const 18
      i32.ge_u
      if
       local.get $0
       local.get $1
       i32.const 2
       i32.add
       i32.load $0
       local.tee $3
       i32.const 16
       i32.shl
       local.get $5
       i32.const 16
       i32.shr_u
       i32.or
       i32.store $0
       local.get $0
       i32.const 4
       i32.add
       local.get $1
       i32.const 6
       i32.add
       i32.load $0
       local.tee $4
       i32.const 16
       i32.shl
       local.get $3
       i32.const 16
       i32.shr_u
       i32.or
       i32.store $0
       local.get $0
       i32.const 8
       i32.add
       local.get $1
       i32.const 10
       i32.add
       i32.load $0
       local.tee $3
       i32.const 16
       i32.shl
       local.get $4
       i32.const 16
       i32.shr_u
       i32.or
       i32.store $0
       local.get $0
       i32.const 12
       i32.add
       local.get $1
       i32.const 14
       i32.add
       i32.load $0
       local.tee $5
       i32.const 16
       i32.shl
       local.get $3
       i32.const 16
       i32.shr_u
       i32.or
       i32.store $0
       local.get $1
       i32.const 16
       i32.add
       local.set $1
       local.get $0
       i32.const 16
       i32.add
       local.set $0
       local.get $2
       i32.const 16
       i32.sub
       local.set $2
       br $while-continue|4
      end
     end
     br $break|2
    end
    local.get $1
    i32.load $0
    local.set $5
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    local.tee $4
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    local.get $4
    i32.load8_u $0
    i32.store8 $0
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    loop $while-continue|5
     local.get $2
     i32.const 19
     i32.ge_u
     if
      local.get $0
      local.get $1
      i32.const 3
      i32.add
      i32.load $0
      local.tee $3
      i32.const 24
      i32.shl
      local.get $5
      i32.const 8
      i32.shr_u
      i32.or
      i32.store $0
      local.get $0
      i32.const 4
      i32.add
      local.get $1
      i32.const 7
      i32.add
      i32.load $0
      local.tee $4
      i32.const 24
      i32.shl
      local.get $3
      i32.const 8
      i32.shr_u
      i32.or
      i32.store $0
      local.get $0
      i32.const 8
      i32.add
      local.get $1
      i32.const 11
      i32.add
      i32.load $0
      local.tee $3
      i32.const 24
      i32.shl
      local.get $4
      i32.const 8
      i32.shr_u
      i32.or
      i32.store $0
      local.get $0
      i32.const 12
      i32.add
      local.get $1
      i32.const 15
      i32.add
      i32.load $0
      local.tee $5
      i32.const 24
      i32.shl
      local.get $3
      i32.const 8
      i32.shr_u
      i32.or
      i32.store $0
      local.get $1
      i32.const 16
      i32.add
      local.set $1
      local.get $0
      i32.const 16
      i32.add
      local.set $0
      local.get $2
      i32.const 16
      i32.sub
      local.set $2
      br $while-continue|5
     end
    end
   end
  end
  local.get $2
  i32.const 16
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $3
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
   local.get $3
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $3
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $4
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u $0
   i32.store8 $0
  end
  local.get $2
  i32.const 8
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $3
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
   local.get $3
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $3
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $1
   local.get $4
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $3
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $4
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u $0
   i32.store8 $0
  end
  local.get $2
  i32.const 4
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   i32.const 1
   i32.add
   local.set $3
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.const 1
   i32.add
   local.set $4
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
   local.get $3
   local.get $4
   i32.load8_u $0
   i32.store8 $0
   local.get $3
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $4
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u $0
   i32.store8 $0
  end
  local.get $2
  i32.const 2
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $4
   i32.const 1
   i32.add
   local.set $1
   local.get $3
   local.get $4
   i32.load8_u $0
   i32.store8 $0
  end
  local.get $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u $0
   i32.store8 $0
  end
 )
 (func $~lib/rt/stub/__renew (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $1
  i32.const 1073741804
  i32.gt_u
  if
   unreachable
  end
  local.get $0
  i32.const 16
  i32.sub
  local.tee $0
  i32.const 4
  i32.sub
  local.tee $2
  i32.load $0
  local.set $6
  global.get $~lib/rt/stub/offset
  local.get $0
  local.get $6
  i32.add
  i32.eq
  local.set $3
  local.get $1
  i32.const 16
  i32.add
  local.tee $4
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.set $5
  local.get $4
  local.get $6
  i32.gt_u
  if
   local.get $3
   if
    local.get $4
    i32.const 1073741820
    i32.gt_u
    if
     unreachable
    end
    local.get $0
    local.get $5
    i32.add
    local.tee $3
    memory.size $0
    local.tee $4
    i32.const 16
    i32.shl
    i32.const 15
    i32.add
    i32.const -16
    i32.and
    local.tee $6
    i32.gt_u
    if
     local.get $4
     local.get $3
     local.get $6
     i32.sub
     i32.const 65535
     i32.add
     i32.const -65536
     i32.and
     i32.const 16
     i32.shr_u
     local.tee $6
     local.get $4
     local.get $6
     i32.gt_s
     select
     memory.grow $0
     i32.const 0
     i32.lt_s
     if
      local.get $6
      memory.grow $0
      i32.const 0
      i32.lt_s
      if
       unreachable
      end
     end
    end
    local.get $3
    global.set $~lib/rt/stub/offset
    local.get $2
    local.get $5
    i32.store $0
   else
    local.get $5
    local.get $6
    i32.const 1
    i32.shl
    local.tee $2
    local.get $2
    local.get $5
    i32.lt_u
    select
    local.tee $2
    i32.const 1073741820
    i32.gt_u
    if
     unreachable
    end
    global.get $~lib/rt/stub/offset
    local.tee $4
    i32.const 4
    i32.add
    local.tee $3
    local.get $2
    i32.const 19
    i32.add
    i32.const -16
    i32.and
    i32.const 4
    i32.sub
    local.tee $5
    i32.add
    local.tee $7
    memory.size $0
    local.tee $2
    i32.const 16
    i32.shl
    i32.const 15
    i32.add
    i32.const -16
    i32.and
    local.tee $8
    i32.gt_u
    if
     local.get $2
     local.get $7
     local.get $8
     i32.sub
     i32.const 65535
     i32.add
     i32.const -65536
     i32.and
     i32.const 16
     i32.shr_u
     local.tee $8
     local.get $2
     local.get $8
     i32.gt_s
     select
     memory.grow $0
     i32.const 0
     i32.lt_s
     if
      local.get $8
      memory.grow $0
      i32.const 0
      i32.lt_s
      if
       unreachable
      end
     end
    end
    local.get $7
    global.set $~lib/rt/stub/offset
    local.get $4
    local.get $5
    i32.store $0
    block $~lib/util/memory/memmove|inlined.0
     local.get $3
     local.tee $2
     local.get $0
     i32.eq
     br_if $~lib/util/memory/memmove|inlined.0
     local.get $0
     local.get $2
     i32.sub
     local.get $6
     i32.sub
     i32.const 0
     local.get $6
     i32.const 1
     i32.shl
     i32.sub
     i32.le_u
     if
      local.get $2
      local.get $0
      local.get $6
      call $~lib/util/memory/memcpy
      br $~lib/util/memory/memmove|inlined.0
     end
     local.get $0
     local.get $2
     i32.gt_u
     if
      local.get $0
      i32.const 7
      i32.and
      local.get $2
      i32.const 7
      i32.and
      i32.eq
      if
       loop $while-continue|0
        local.get $2
        i32.const 7
        i32.and
        if
         local.get $6
         i32.eqz
         br_if $~lib/util/memory/memmove|inlined.0
         local.get $6
         i32.const 1
         i32.sub
         local.set $6
         local.get $2
         local.tee $4
         i32.const 1
         i32.add
         local.set $2
         local.get $0
         local.tee $5
         i32.const 1
         i32.add
         local.set $0
         local.get $4
         local.get $5
         i32.load8_u $0
         i32.store8 $0
         br $while-continue|0
        end
       end
       loop $while-continue|1
        local.get $6
        i32.const 8
        i32.ge_u
        if
         local.get $2
         local.get $0
         i64.load $0
         i64.store $0
         local.get $6
         i32.const 8
         i32.sub
         local.set $6
         local.get $2
         i32.const 8
         i32.add
         local.set $2
         local.get $0
         i32.const 8
         i32.add
         local.set $0
         br $while-continue|1
        end
       end
      end
      loop $while-continue|2
       local.get $6
       if
        local.get $2
        local.tee $4
        i32.const 1
        i32.add
        local.set $2
        local.get $0
        local.tee $5
        i32.const 1
        i32.add
        local.set $0
        local.get $4
        local.get $5
        i32.load8_u $0
        i32.store8 $0
        local.get $6
        i32.const 1
        i32.sub
        local.set $6
        br $while-continue|2
       end
      end
     else
      local.get $0
      i32.const 7
      i32.and
      local.get $2
      i32.const 7
      i32.and
      i32.eq
      if
       loop $while-continue|3
        local.get $2
        local.get $6
        i32.add
        i32.const 7
        i32.and
        if
         local.get $6
         i32.eqz
         br_if $~lib/util/memory/memmove|inlined.0
         local.get $2
         local.get $6
         i32.const 1
         i32.sub
         local.tee $6
         i32.add
         local.get $0
         local.get $6
         i32.add
         i32.load8_u $0
         i32.store8 $0
         br $while-continue|3
        end
       end
       loop $while-continue|4
        local.get $6
        i32.const 8
        i32.ge_u
        if
         local.get $2
         local.get $6
         i32.const 8
         i32.sub
         local.tee $6
         i32.add
         local.get $0
         local.get $6
         i32.add
         i64.load $0
         i64.store $0
         br $while-continue|4
        end
       end
      end
      loop $while-continue|5
       local.get $6
       if
        local.get $2
        local.get $6
        i32.const 1
        i32.sub
        local.tee $6
        i32.add
        local.get $0
        local.get $6
        i32.add
        i32.load8_u $0
        i32.store8 $0
        br $while-continue|5
       end
      end
     end
    end
    local.get $3
    local.set $0
   end
  else
   local.get $3
   if
    local.get $0
    local.get $5
    i32.add
    global.set $~lib/rt/stub/offset
    local.get $2
    local.get $5
    i32.store $0
   end
  end
  local.get $0
  i32.const 4
  i32.sub
  local.get $1
  i32.store $0 offset=16
  local.get $0
  i32.const 16
  i32.add
 )
 (func $node_modules/@hyperoracle/zkgraph-lib/common/receive/receiveMatchedEvents (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  i32.const 16
  i32.const 9
  call $~lib/rt/stub/__new
  local.tee $3
  i32.const 0
  i32.store $0
  local.get $3
  i32.const 0
  i32.store $0 offset=4
  local.get $3
  i32.const 0
  i32.store $0 offset=8
  local.get $3
  i32.const 0
  i32.store $0 offset=12
  i32.const 32
  i32.const 1
  call $~lib/rt/stub/__new
  local.tee $5
  i32.const 32
  call $~lib/memory/memory.fill
  local.get $3
  local.get $5
  i32.store $0
  local.get $3
  local.get $5
  i32.store $0 offset=4
  local.get $3
  i32.const 32
  i32.store $0 offset=8
  local.get $3
  i32.const 0
  i32.store $0 offset=12
  loop $for-loop|0
   local.get $1
   local.get $4
   i32.gt_s
   if
    local.get $0
    local.get $2
    local.get $4
    i32.const 28
    i32.mul
    i32.add
    local.tee $5
    i32.load $0
    i32.add
    i32.const 20
    call $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromRawarrPtr
    local.set $6
    local.get $0
    local.get $5
    i32.const 4
    i32.add
    i32.load $0
    i32.add
    i32.const 32
    call $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromRawarrPtr
    local.set $7
    local.get $5
    i32.const 8
    i32.add
    i32.load $0
    local.tee $8
    if (result i32)
     local.get $0
     local.get $8
     i32.add
     i32.const 32
     call $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromRawarrPtr
    else
     i32.const 12
     i32.const 7
     call $~lib/rt/stub/__new
     local.tee $8
     if (result i32)
      local.get $8
     else
      i32.const 12
      i32.const 8
      call $~lib/rt/stub/__new
     end
     i32.const 0
     call $~lib/typedarray/Uint8Array#constructor
    end
    local.set $8
    local.get $5
    i32.const 12
    i32.add
    i32.load $0
    local.tee $9
    if (result i32)
     local.get $0
     local.get $9
     i32.add
     i32.const 32
     call $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromRawarrPtr
    else
     i32.const 12
     i32.const 7
     call $~lib/rt/stub/__new
     local.tee $9
     if (result i32)
      local.get $9
     else
      i32.const 12
      i32.const 8
      call $~lib/rt/stub/__new
     end
     i32.const 0
     call $~lib/typedarray/Uint8Array#constructor
    end
    local.set $9
    local.get $5
    i32.const 16
    i32.add
    i32.load $0
    local.tee $10
    if (result i32)
     local.get $0
     local.get $10
     i32.add
     i32.const 32
     call $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromRawarrPtr
    else
     i32.const 12
     i32.const 7
     call $~lib/rt/stub/__new
     local.tee $10
     if (result i32)
      local.get $10
     else
      i32.const 12
      i32.const 8
      call $~lib/rt/stub/__new
     end
     i32.const 0
     call $~lib/typedarray/Uint8Array#constructor
    end
    local.set $10
    local.get $5
    i32.const 20
    i32.add
    i32.load $0
    local.tee $11
    if (result i32)
     local.get $0
     local.get $11
     i32.add
     local.get $5
     i32.const 24
     i32.add
     i32.load $0
     call $~lib/@hyperoracle/zkgraph-lib/common/types/bytes/Bytes.fromRawarrPtr
    else
     i32.const 12
     i32.const 7
     call $~lib/rt/stub/__new
     local.tee $5
     if (result i32)
      local.get $5
     else
      i32.const 12
      i32.const 8
      call $~lib/rt/stub/__new
     end
     i32.const 0
     call $~lib/typedarray/Uint8Array#constructor
    end
    local.set $5
    i32.const 24
    i32.const 6
    call $~lib/rt/stub/__new
    local.tee $11
    local.get $6
    i32.store $0
    local.get $11
    local.get $7
    i32.store $0 offset=4
    local.get $11
    local.get $8
    i32.store $0 offset=8
    local.get $11
    local.get $9
    i32.store $0 offset=12
    local.get $11
    local.get $10
    i32.store $0 offset=16
    local.get $11
    local.get $5
    i32.store $0 offset=20
    local.get $3
    i32.load $0 offset=12
    local.tee $5
    i32.const 1
    i32.add
    local.tee $6
    local.get $3
    i32.load $0 offset=8
    local.tee $7
    i32.const 2
    i32.shr_u
    i32.gt_u
    if
     local.get $6
     i32.const 268435455
     i32.gt_u
     if
      unreachable
     end
     local.get $3
     i32.load $0
     local.tee $8
     i32.const 1073741820
     local.get $7
     i32.const 1
     i32.shl
     local.tee $9
     local.get $9
     i32.const 1073741820
     i32.ge_u
     select
     local.tee $9
     i32.const 8
     local.get $6
     local.get $6
     i32.const 8
     i32.le_u
     select
     i32.const 2
     i32.shl
     local.tee $10
     local.get $9
     local.get $10
     i32.gt_u
     select
     local.tee $9
     call $~lib/rt/stub/__renew
     local.tee $10
     local.get $7
     i32.add
     local.get $9
     local.get $7
     i32.sub
     call $~lib/memory/memory.fill
     local.get $8
     local.get $10
     i32.ne
     if
      local.get $3
      local.get $10
      i32.store $0
      local.get $3
      local.get $10
      i32.store $0 offset=4
     end
     local.get $3
     local.get $9
     i32.store $0 offset=8
    end
    local.get $3
    i32.load $0 offset=4
    local.get $5
    i32.const 2
    i32.shl
    i32.add
    local.get $11
    i32.store $0
    local.get $3
    local.get $6
    i32.store $0 offset=12
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
  i32.const 12
  i32.const 7
  call $~lib/rt/stub/__new
  local.tee $0
  if (result i32)
   local.get $0
  else
   i32.const 12
   i32.const 8
   call $~lib/rt/stub/__new
  end
  i32.const 0
  call $~lib/typedarray/Uint8Array#constructor
  local.set $0
  local.get $3
  i32.load $0 offset=12
  i32.const 0
  i32.gt_s
  if
   local.get $3
   i32.load $0 offset=12
   i32.eqz
   if
    unreachable
   end
   local.get $3
   i32.load $0 offset=4
   i32.load $0
   local.tee $0
   i32.eqz
   if
    unreachable
   end
   local.get $0
   i32.load $0
   local.set $0
  end
  local.get $0
  i32.load $0 offset=8
  i32.const 20
  i32.eq
  call $~lib/@hyperoracle/zkgraph-lib/common/zkwasm/require
  local.get $0
 )
 (func $node_modules/@hyperoracle/zkgraph-lib/common/entries/asmain (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.load $0 offset=4
  local.get $1
  i32.load $0 offset=8
  i32.const 2
  i32.shr_u
  i32.const 7
  i32.div_u
  local.get $1
  i32.load $0 offset=4
  call $node_modules/@hyperoracle/zkgraph-lib/common/receive/receiveMatchedEvents
 )
 (func $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/read_bytes_from_u64_to_dst (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i64)
  (local $5 i32)
  loop $for-loop|0
   local.get $3
   i32.const 3
   i32.shl
   local.get $1
   i32.lt_s
   if
    local.get $3
    i32.const 3
    i32.shl
    i32.const 8
    i32.add
    local.get $1
    i32.lt_s
    if
     local.get $2
     call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/wasm_input
     local.set $4
     local.get $3
     local.get $0
     i32.load $0 offset=8
     i32.const 3
     i32.shr_u
     i32.ge_u
     if
      unreachable
     end
     local.get $0
     i32.load $0 offset=4
     local.get $3
     i32.const 3
     i32.shl
     i32.add
     local.get $4
     i64.store $0
    else
     local.get $2
     call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/wasm_input
     local.set $4
     local.get $3
     i32.const 3
     i32.shl
     local.set $5
     loop $for-loop|1
      local.get $1
      local.get $5
      i32.gt_s
      if
       local.get $5
       local.get $0
       i32.load $0 offset=8
       i32.ge_u
       if
        unreachable
       end
       local.get $0
       i32.load $0 offset=4
       local.get $5
       i32.add
       local.get $4
       i64.store8 $0
       local.get $4
       i64.const 8
       i64.shr_s
       local.set $4
       local.get $5
       i32.const 1
       i32.add
       local.set $5
       br $for-loop|1
      end
     end
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
 )
 (func $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/read_private_len_then_bytes (result i32)
  (local $0 i32)
  (local $1 i32)
  i32.const 0
  call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/wasm_input
  i32.wrap_i64
  local.set $0
  i32.const 12
  i32.const 11
  call $~lib/rt/stub/__new
  local.tee $1
  if (result i32)
   local.get $1
  else
   i32.const 12
   i32.const 12
   call $~lib/rt/stub/__new
  end
  local.get $0
  call $~lib/typedarray/Uint8Array#constructor
  local.tee $1
  local.get $0
  i32.const 0
  call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/read_bytes_from_u64_to_dst
  local.get $1
 )
 (func $node_modules/@hyperoracle/zkgraph-lib/common/entries/zkmain
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/read_private_len_then_bytes
  local.set $1
  call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/read_private_len_then_bytes
  local.set $2
  i32.const 1
  call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/wasm_input
  i32.wrap_i64
  local.set $3
  i32.const 12
  i32.const 11
  call $~lib/rt/stub/__new
  local.tee $4
  if (result i32)
   local.get $4
  else
   i32.const 12
   i32.const 12
   call $~lib/rt/stub/__new
  end
  local.get $3
  call $~lib/typedarray/Uint8Array#constructor
  local.tee $4
  local.get $3
  i32.const 1
  call $node_modules/@hyperoracle/zkgraph-lib/common/zkwasm/read_bytes_from_u64_to_dst
  block $__inlined_func$node_modules/@hyperoracle/zkgraph-lib/common/types/bytes/ByteArray#equals (result i32)
   i32.const 0
   local.get $1
   i32.load $0 offset=4
   local.get $2
   i32.load $0 offset=8
   i32.const 2
   i32.shr_u
   i32.const 7
   i32.div_u
   local.get $2
   i32.load $0 offset=4
   call $node_modules/@hyperoracle/zkgraph-lib/common/receive/receiveMatchedEvents
   local.tee $1
   i32.load $0 offset=8
   local.get $4
   i32.load $0 offset=8
   i32.ne
   br_if $__inlined_func$node_modules/@hyperoracle/zkgraph-lib/common/types/bytes/ByteArray#equals
   drop
   loop $for-loop|0
    local.get $0
    local.get $1
    i32.load $0 offset=8
    i32.lt_s
    if
     local.get $0
     local.get $1
     i32.load $0 offset=8
     i32.ge_u
     if
      unreachable
     end
     local.get $0
     local.get $4
     i32.load $0 offset=8
     i32.ge_u
     if
      unreachable
     end
     i32.const 0
     local.get $1
     i32.load $0 offset=4
     local.get $0
     i32.add
     i32.load8_u $0
     local.get $4
     i32.load $0 offset=4
     local.get $0
     i32.add
     i32.load8_u $0
     i32.ne
     br_if $__inlined_func$node_modules/@hyperoracle/zkgraph-lib/common/types/bytes/ByteArray#equals
     drop
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|0
    end
   end
   i32.const 1
  end
  call $~lib/@hyperoracle/zkgraph-lib/common/zkwasm/require
 )
 (func $~lib/rt/stub/__unpin (param $0 i32)
  nop
 )
 (func $~lib/rt/stub/__collect
  nop
 )
 (func $~start
  i32.const 70620
  global.set $~lib/rt/stub/offset
 )
)
