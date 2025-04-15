<?php

namespace App\Http\Middleware;

use BackedEnum;

trait ParseStringableParams
{
    protected static function parseStringableParam(array|string|BackedEnum $param, string $separator = '|'): string
    {
        // Convert Enum to its value if an Enum is passed
        if ($param instanceof BackedEnum) {
            $param = $param->value;
        }

        if (is_array($param)) {
            $param = array_map(fn ($r) => $r instanceof BackedEnum ? $r->value : $r, $param);

            return implode($separator, $param);
        }

        return (string) $param;
    }
}